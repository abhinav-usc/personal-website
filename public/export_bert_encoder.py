"""
Export bert-base-uncased ENCODER (no MLM head) to ONNX for browser inference.

Run this once locally:
    pip install transformers optimum onnx onnxruntime
    python export_bert_encoder.py

This creates a folder you can put in your public/ directory:
    public/
      bert-base-encoder/
        model.onnx           (~440MB)
        model_quantized.onnx  (~110MB, use this one)
        config.json
        tokenizer.json
        tokenizer_config.json
"""

import os
import shutil
from pathlib import Path
from transformers import BertModel, BertTokenizer
import torch
import json

OUTPUT_DIR = Path("bert-base-encoder")
OUTPUT_DIR.mkdir(exist_ok=True)

print("[1/4] Loading bert-base-uncased encoder (no MLM head)...")
model = BertModel.from_pretrained("bert-base-uncased")
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

model.eval()

print("[2/4] Exporting to ONNX...")
dummy_input = tokenizer("hello", return_tensors="pt")

# Export with last_hidden_state as output
torch.onnx.export(
    model,
    (dummy_input["input_ids"], dummy_input["attention_mask"], dummy_input["token_type_ids"]),
    str(OUTPUT_DIR / "model.onnx"),
    input_names=["input_ids", "attention_mask", "token_type_ids"],
    output_names=["last_hidden_state", "pooler_output"],
    dynamic_axes={
        "input_ids": {0: "batch", 1: "sequence"},
        "attention_mask": {0: "batch", 1: "sequence"},
        "token_type_ids": {0: "batch", 1: "sequence"},
        "last_hidden_state": {0: "batch", 1: "sequence"},
        "pooler_output": {0: "batch"},
    },
    opset_version=14,
    do_constant_folding=True,
)

print("[3/4] Quantizing (int8, ~4x smaller)...")
try:
    from onnxruntime.quantization import quantize_dynamic, QuantType
    quantize_dynamic(
        str(OUTPUT_DIR / "model.onnx"),
        str(OUTPUT_DIR / "model_quantized.onnx"),
        weight_type=QuantType.QUInt8,
    )
    print(f"    model.onnx: {(OUTPUT_DIR / 'model.onnx').stat().st_size / 1e6:.0f} MB")
    print(f"    model_quantized.onnx: {(OUTPUT_DIR / 'model_quantized.onnx').stat().st_size / 1e6:.0f} MB")
except ImportError:
    print("    onnxruntime.quantization not available, skipping quantization")

print("[4/4] Saving tokenizer and config...")
tokenizer.save_pretrained(str(OUTPUT_DIR))

# Verify the export
print("\nVerifying ONNX output...")
import onnxruntime as ort
session = ort.InferenceSession(str(OUTPUT_DIR / "model_quantized.onnx"))
outputs = session.get_outputs()
for o in outputs:
    print(f"  Output: {o.name}, shape: {o.shape}, type: {o.type}")

# Test inference
import numpy as np
test_inputs = tokenizer("thunder", return_tensors="np")
result = session.run(None, {
    "input_ids": test_inputs["input_ids"],
    "attention_mask": test_inputs["attention_mask"],
    "token_type_ids": test_inputs["token_type_ids"],
})
print(f"  'thunder' CLS shape: {result[0][0][0].shape}")  # Should be (768,)
print(f"  'thunder' CLS norm: {np.linalg.norm(result[0][0][0]):.2f}")  # Should be >> 0

print(f"\n✓ Done! Copy '{OUTPUT_DIR}/' to your public/ folder.")
print(f"  Files needed for browser:")
print(f"    public/bert-base-encoder/model_quantized.onnx")
print(f"    public/bert-base-encoder/tokenizer.json")
print(f"    public/bert-base-encoder/tokenizer_config.json")
print(f"    public/bert-base-encoder/config.json")
