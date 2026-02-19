import torch

# Load the weights from the .pt file
weights = torch.load('../public/NNmodel_bert.pt')

# Print the keys and their corresponding tensor shapes/values
for name, param in weights.items():
    print(f"Layer name: {name}")
    print(f"Shape: {param.shape}")
    print(f"Values (first few): {param.data.flatten()[:5]}") # Print the first 5 values
    print("-" * 20)