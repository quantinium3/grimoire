import java.io.OutputStream;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        // Image
        double aspectRatio = 16.0 / 9.0;
        int imageWidth = 400;

        // Calculate the image height, and ensure that it's at least 1
        int imageHeight = (int) (imageWidth / aspectRatio);
        imageHeight = (imageHeight < 1) ? 1 : imageHeight;

        // World
        HittableList world = new HittableList();
        world.add(new Sphere(new Vec3(0, 0, -1), 0.5)); // Add a sphere to the world
        world.add(new Sphere(new Vec3(0, -100.5, -1), 100)); // Add a large ground sphere

        // Camera
        double focalLength = 1.0;
        double viewportHeight = 2.0;
        double viewportWidth = viewportHeight * ((double) imageWidth / imageHeight);
        Vec3 cameraCenter = new Vec3(0, 0, 0);

        // Calculate the vectors across the horizontal and down the vertical viewport
        // edges
        Vec3 viewportU = new Vec3(viewportWidth, 0, 0);
        Vec3 viewportV = new Vec3(0, -viewportHeight, 0);

        // Calculate the horizontal and vertical delta vectors from pixel to pixel
        Vec3 pixelDeltaU = viewportU.divide(imageWidth);
        Vec3 pixelDeltaV = viewportV.divide(imageHeight);

        // Calculate the location of the upper left pixel
        Vec3 viewportUpperLeft = cameraCenter
                .sub(new Vec3(0, 0, focalLength))
                .sub(viewportU.divide(2))
                .sub(viewportV.divide(2));
        Vec3 pixel00Loc = viewportUpperLeft.add(pixelDeltaU.add(pixelDeltaV).multiply(0.5));

        // Render
        System.out.println("P3");
        System.out.println(imageWidth + " " + imageHeight);
        System.out.println("255");

        for (int j = 0; j < imageHeight; j++) {
            System.err.print("\rScanlines remaining: " + (imageHeight - j) + " ");
            System.err.flush();
            for (int i = 0; i < imageWidth; i++) {
                Vec3 pixelCenter = pixel00Loc
                        .add(pixelDeltaU.multiply(i))
                        .add(pixelDeltaV.multiply(j));
                Vec3 rayDirection = pixelCenter.sub(cameraCenter);
                Ray r = new Ray(cameraCenter, rayDirection);

                Color pixelColor = rayColor(r, world); // Use the rayColor function
                pixelColor.writeColor(System.out);
            }
        }

        System.err.println("\rDone.                 ");
    }

    public static Color rayColor(Ray r, HittableList world) {
        HitRecord rec = new HitRecord();

        if (world.hit(r, 0, RTWeekend.INFINITY, rec)) {
            // Map normal components from [-1,1] to [0,1]
            Vec3 normalColor = new Vec3(
                    rec.normal.x() + 1,
                    rec.normal.y() + 1,
                    rec.normal.z() + 1).multiply(0.5);
            return new Color(normalColor);
        }

        // Gradient background
        Vec3 unitDir = Vec3.unitVector(r.direction());
        double a = 0.5 * (unitDir.y() + 1.0);
        Vec3 color = new Vec3(1.0, 1.0, 1.0).multiply(1 - a)
                .add(new Vec3(0.5, 0.7, 1.0).multiply(a));
        return new Color(color);
    }
}
