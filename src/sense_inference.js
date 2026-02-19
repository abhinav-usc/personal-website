/**
 * SENSE Inference Module
 * 
 * Uses onnxruntime-web for BERT encoder inference (guaranteed last_hidden_state output)
 * and @huggingface/transformers only for tokenization.
 * 
 * Setup:
 *   npm install onnxruntime-web @huggingface/transformers
 * 
 * Required files in public/:
 *   public/bert-base-encoder/model_quantized.onnx  (exported via export_bert_encoder.py)
 *   public/sense_weights.json
 * 
 * The tokenizer is loaded from HuggingFace (Xenova/bert-base-uncased) -- just the
 * tokenizer files, NOT the broken MLM model.
 */

import * as ort from 'onnxruntime-web';
import { AutoTokenizer } from '@huggingface/transformers';

const MODALITIES = [
  'Auditory', 'Gustatory', 'Haptic', 'Interoceptive', 'Olfactory',
  'Visual', 'Foot_leg', 'Hand_arm', 'Head', 'Mouth', 'Torso'
];

// ─── Matrix math ─────────────────────────────────────────────
function matmul(vec, weightMatrix, rows, cols) {
  const out = new Float32Array(rows);
  for (let r = 0; r < rows; r++) {
    let sum = 0;
    for (let c = 0; c < cols; c++) {
      sum += weightMatrix[r * cols + c] * vec[c];
    }
    out[r] = sum;
  }
  return out;
}

function addBias(vec, bias) {
  return vec.map((v, i) => v + bias[i]);
}

function relu(vec) {
  return vec.map(v => Math.max(0, v));
}

// ─── SENSE Model ─────────────────────────────────────────────
export class SenseModel {
  constructor() {
    this.tokenizer = null;
    this.session = null;
    this.weights = null;
    this.ready = false;
  }

  async load(weightsUrl = '/sense_weights.json', modelUrl = '/bert-base-encoder/model_quantized.onnx') {
    // 1. Load tokenizer (just the tokenizer, from Xenova -- this part works fine)
    console.log('[SENSE] Loading BERT tokenizer...');
    this.tokenizer = await AutoTokenizer.from_pretrained('Xenova/bert-base-uncased');
    console.log('[SENSE] Tokenizer loaded.');

    // 2. Load BERT encoder ONNX model directly via onnxruntime-web
    console.log('[SENSE] Loading BERT encoder ONNX model...');
    this.session = await ort.InferenceSession.create(modelUrl, {
      executionProviders: ['wasm'],
    });
    
    // Log model inputs/outputs for verification
    console.log('[SENSE] Model inputs:', this.session.inputNames);
    console.log('[SENSE] Model outputs:', this.session.outputNames);
    // Should be: inputs = [input_ids, attention_mask, token_type_ids]
    //            outputs = [last_hidden_state, pooler_output]
    console.log('[SENSE] BERT encoder loaded.');

    // 3. Sanity check
    console.log('[SENSE] Running sanity check with "hello"...');
    const testCls = await this.getEmbedding('hello');
    const norm = Math.sqrt(testCls.reduce((s, v) => s + v * v, 0));
    console.log('[SENSE] "hello" CLS norm:', norm.toFixed(2), 
      `(dim=${testCls.length})`,
      norm > 1 ? '✓ GOOD' : '✗ BAD');

    // 4. Load projection weights
    console.log('[SENSE] Loading projection weights...');
    const res = await fetch(weightsUrl);
    const data = await res.json();
    
    this.weights = {
      fc1_w: new Float32Array(data.data_0),  // [64, 768]
      fc1_b: new Float32Array(data.data_1),  // [64]
      fc2_w: new Float32Array(data.data_2),  // [128, 64]
      fc2_b: new Float32Array(data.data_3),  // [128]
      fc3_w: new Float32Array(data.data_4),  // [11, 128]
      fc3_b: new Float32Array(data.data_5),  // [11]
    };

    // Full sanity prediction
    const testScores = this.projectToSensorimotor(testCls);
    console.log('[SENSE] "hello":', 
      MODALITIES.map((m, i) => `${m}=${testScores[i].toFixed(2)}`).join(', '));

    this.ready = true;
    console.log('[SENSE] ✓ Model fully ready.');
  }

  async getEmbedding(text) {
    if (!this.tokenizer || !this.session) throw new Error('Model not loaded.');

    // Tokenize
    const encoded = this.tokenizer(text, { 
      padding: true, 
      truncation: true,
    });

    // Convert to ORT tensors (BigInt64Array for int64 input_ids)
    const seqLen = encoded.input_ids.data.length;
    
    const inputIds = new ort.Tensor(
      'int64', 
      BigInt64Array.from(encoded.input_ids.data.map(v => BigInt(v))),
      [1, seqLen]
    );
    const attentionMask = new ort.Tensor(
      'int64',
      BigInt64Array.from(encoded.attention_mask.data.map(v => BigInt(v))),
      [1, seqLen]
    );
    const tokenTypeIds = new ort.Tensor(
      'int64',
      BigInt64Array.from(new Array(seqLen).fill(0n)),
      [1, seqLen]
    );

    // Run inference
    const feeds = {
      input_ids: inputIds,
      attention_mask: attentionMask,
      token_type_ids: tokenTypeIds,
    };
    
    const output = await this.session.run(feeds);
    
    // Extract CLS token (first token) from last_hidden_state
    // Shape: [1, seq_len, 768] -- CLS is at position 0
    const hiddenState = output.last_hidden_state;
    const cls = new Float32Array(768);
    for (let i = 0; i < 768; i++) {
      cls[i] = hiddenState.data[i];
    }

    return cls;
  }

  projectToSensorimotor(embedding) {
    if (!this.weights) throw new Error('Weights not loaded.');
    const w = this.weights;
    
    // 768 -> 64 (ReLU) -> 128 (ReLU) -> 11
    let h = matmul(embedding, w.fc1_w, 64, 768);
    h = addBias(h, w.fc1_b);
    h = relu(h);

    h = matmul(h, w.fc2_w, 128, 64);
    h = addBias(h, w.fc2_b);
    h = relu(h);

    h = matmul(h, w.fc3_w, 11, 128);
    h = addBias(h, w.fc3_b);
    return h;
  }

  async predict(text) {
    const embedding = await this.getEmbedding(text);
    const scores = this.projectToSensorimotor(embedding);
    
    const result = {};
    MODALITIES.forEach((m, i) => {
      result[m] = Math.round(scores[i] * 1000) / 1000;
    });
    
    console.log(`[SENSE] "${text}":`, result);
    return result;
  }
}