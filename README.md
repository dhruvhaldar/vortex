# Vortex: Interactive 3D WebGL CFD Showcase

A high-fidelity, Vercel-deployable WebGL application tailored for interactive CFD visualization.

## Overview

This project visualizes fluid dynamics data (flow around a cylinder) using a modern web stack:
- **Next.js**: Framework
- **React Three Fiber (R3F)**: 3D Rendering
- **PyVista**: Data Pre-processing (Python)
- **Tailwind CSS & Framer Motion**: UI Styling and Animation

## Features

- **Interactive 3D Scene**: Explore the flow field with scroll-driven camera controls.
- **Cinematic Rendering**: Uses Post-processing effects like Bloom and SSAO.
- **Data-Driven**: Visualizes real (mock) CFD data generated via Python script.
- **Responsive UI**: Overlay adapts to scroll position.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Data (Optional)

The project comes with pre-generated assets in `public/assets/`. If you want to regenerate them:

1.  Ensure you have Python installed.
2.  Install Python dependencies:
    ```bash
    pip install pyvista meshio matplotlib numpy
    ```
3.  Run the generation script:
    ```bash
    python3 data_pipeline/generate_cfd_data.py
    ```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

This project is optimized for Vercel. Simply import the repository into Vercel and deploy.

## Structure

- `src/components/Scene.tsx`: Main 3D scene setup.
- `src/components/CFDModel.tsx`: Loads GLTF assets and applies custom shaders.
- `src/components/CameraHandler.tsx`: Handles scroll-based camera movement.
- `data_pipeline/`: Python scripts for data generation.
- `public/assets/`: 3D models and textures.
