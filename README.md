# CNN-EXPLAINER-FRONTEND


**A frontend project to visually explain CNN architectures.**

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Contributing](#contributing)

---

## Overview

CNN-EXPLAINER-FRONTEND is a React + TypeScript project that visually demonstrates Convolutional Neural Network layers and their operations. It helps learners understand CNNs by interactive visualizations.

---

## Features

* Interactive visualization of CNN layers: Conv, MaxPool, Dropout, etc.
* Layer-by-layer exploration with real-time updates.
* Lightweight React + TypeScript frontend.
* Easy integration with backend APIs for image data.

---

## Project Structure

```
CNN-Explainer-frontend/
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── eslint.config.js
├── public/
│   ├── glacier.jpg
│   └── vite.svg
├── src/
│   ├── Apis/
│   │   └── Image.ts
│   ├── components/
│   │   ├── ConvLayer.tsx
│   │   ├── DropoutLayer.tsx
│   │   ├── FeatureFlowView.tsx
│   │   ├── LayerExploration.tsx
│   │   ├── LoadingComp.tsx
│   │   ├── NavBar.tsx
│   │   ├── RGBLayers.tsx
│   │   ├── ResultantLayerComp.tsx
│   │   ├── ReluLayer.tsx
│   │   ├── Connector.tsx
│   │   ├── ConvolutionVisualizer.tsx
│   │   ├── FloatingModel.tsx
│   │   ├── DropoutFeatureFlowView.tsx
│   │   ├── MaxPool.tsx
│   │   └── Connection.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
└── bun.lock
```

---

## Getting Started

### Prerequisites

* Node.js and npm installed.
* TypeScript knowledge recommended.

### Installation

```bash
# Clone the repo
git clone https://github.com/Kratos-024/CNN-Explainer-frontend.git

# Navigate to project folder
cd CNN-Explainer-frontend

# Install dependencies
bun install
```

### Usage

```bash
# Start development server
bub run  dev
```

### Testing

```bash
# Run tests
npm test
```

---

## Contributing

* Fork the repository and clone locally.
* Create a new branch for your feature.
* Make changes and commit.
* Push to your fork and create a Pull Request.
* Review will be done and merged.
