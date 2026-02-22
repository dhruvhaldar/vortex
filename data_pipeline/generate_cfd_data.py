import pyvista as pv
import numpy as np
import os

def generate_flow_data():
    # Define grid dimensions
    # Create a box grid representing a wind tunnel section
    # x: -2 to 4 (flow direction), y: -2 to 2, z: -2 to 2
    # Higher resolution for better visuals
    xr = np.linspace(-3, 5, 60)
    yr = np.linspace(-2, 2, 40)
    zr = np.linspace(-2, 2, 40)

    grid = pv.RectilinearGrid(xr, yr, zr)

    # Convert to UnstructuredGrid or PolyData for easier handling if needed,
    # but RectilinearGrid is fine.
    # However, for GLB export, we usually want surface geometry or streamlines.
    # Exporting a full volume to GLB for web might be too heavy or not supported (GLB is surface).

    # So we should generate:
    # 1. A surface mesh of the object (Cylinder)
    # 2. Streamlines (tubes)
    # 3. Maybe a slice/plane with colors.

    # Let's do a multiblock dataset or just combine meshes.

    # 1. The Obstacle (Cylinder along Z axis? No, let's do Sphere for simplicity or Cylinder along Y)
    # Cylinder along Z axis
    radius = 1.0
    cylinder = pv.Cylinder(center=(0, 0, 0), direction=(0, 0, 1), radius=radius, height=4.0, resolution=50)

    # 2. Flow calculation points (the grid)
    # We will compute flow on the grid points
    points = grid.points
    x = points[:, 0]
    y = points[:, 1]
    z = points[:, 2]

    # Potential flow around a cylinder (approximate 2D flow in XY plane, invariant in Z)
    # r = sqrt(x^2 + y^2)
    # theta = atan2(y, x)
    # Vr = V_inf * (1 - R^2/r^2) * cos(theta)
    # Vtheta = -V_inf * (1 + R^2/r^2) * sin(theta)

    # Vx = Vr * cos(theta) - Vtheta * sin(theta)
    # Vy = Vr * sin(theta) + Vtheta * cos(theta)

    V_inf = 10.0
    R = radius
    r = np.sqrt(x**2 + y**2)

    # Avoid division by zero inside cylinder
    mask = r < R
    r[mask] = R  # Clamp to avoid nan, we will cut this out anyway

    theta = np.arctan2(y, x)

    Vr = V_inf * (1 - (R/r)**2) * np.cos(theta)
    Vtheta = -V_inf * (1 + (R/r)**2) * np.sin(theta)

    Vx = Vr * np.cos(theta) - Vtheta * np.sin(theta)
    Vy = Vr * np.sin(theta) + Vtheta * np.cos(theta)
    Vz = np.zeros_like(Vx)

    # Inside cylinder, velocity is 0
    Vx[mask] = 0
    Vy[mask] = 0

    vectors = np.column_stack((Vx, Vy, Vz))
    grid["Velocity"] = vectors
    grid["Pressure"] = 0.5 * (V_inf**2 - np.sum(vectors**2, axis=1)) # Bernoulli

    # 3. Generate Streamlines
    # Seed points for streamlines
    # Line source at x = -2.5
    line = pv.Line((-2.5, -1.5, 0), (-2.5, 1.5, 0), resolution=20)
    # Expand to 3D rake?
    # Let's use a plane source for seeds
    seeds = pv.Plane(center=(-2.5, 0, 0), direction=(1, 0, 0), i_size=3, j_size=3, i_resolution=10, j_resolution=10)

    streamlines = grid.streamlines_from_source(seeds, vectors="Velocity", integration_direction="forward", max_time=10.0)

    # Create tubes for streamlines to give them volume
    tubes = streamlines.tube(radius=0.03)

    # 4. Combine Geometry
    # We want to export the cylinder and the streamlines.
    # Maybe also the seeds? No.

    # Color tubes by Velocity Magnitude
    tubes["VelocityMag"] = np.linalg.norm(tubes["Velocity"], axis=1)

    # Cylinder color
    cylinder["VelocityMag"] = np.zeros(cylinder.n_points) # Dummy

    # Merge
    # We need to make sure field names match if we merge, or export separate files.
    # Exporting separate files gives more flexibility in Three.js (different materials).

    output_dir = "public/assets"
    os.makedirs(output_dir, exist_ok=True)

    # Export Streamlines
    print(f"Exporting streamlines to {output_dir}/streamlines.glb")
    # Plotter is needed for export_gltf usually, but save might work
    # tubes.save(f"{output_dir}/streamlines.vtk") # Backup

    # To save as GLB with PyVista, we often need a Plotter or use vtkGLTFExporter
    # Since we are headless, let's try direct save if supported.
    # PyVista 0.47 might support .glb in save.
    try:
        # tubes.save(f"{output_dir}/streamlines.glb")
        # GLB export in pyvista might expect a plotter.
        # Let's use a plotter with off_screen=True
        pl = pv.Plotter(off_screen=True)
        pl.add_mesh(tubes, scalars="VelocityMag", cmap="jet")
        # pl.export_gltf(f"{output_dir}/streamlines.gltf") # It usually creates .gltf and .bin
        # We prefer .glb.
        # Let's try .gltf first as it is safer.
        pl.export_gltf(f"{output_dir}/streamlines.gltf")
        print("Exported streamlines.gltf")
    except Exception as e:
        print(f"Failed to export GLTF via plotter: {e}")
        # Fallback: simple vtk
        tubes.save(f"{output_dir}/streamlines.vtk")

    # Export Cylinder
    try:
        pl2 = pv.Plotter(off_screen=True)
        pl2.add_mesh(cylinder, color="gray")
        pl2.export_gltf(f"{output_dir}/cylinder.gltf")
        print("Exported cylinder.gltf")
    except Exception as e:
        print(f"Failed to export cylinder: {e}")
        cylinder.save(f"{output_dir}/cylinder.vtk")

if __name__ == "__main__":
    generate_flow_data()
