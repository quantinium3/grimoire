import java.io.FileWriter;
import java.io.IOException;

public class Color extends Vec3{
    public Color(){
        super();
    }

    public Color(double r, double g, double b){
        super(r,g,b);
    }

    @Override
    public Color add(Vec3 v){
        return new Color(x() + v.x(), y() + v.y(), z() + v.z());
    }

    public Color multiply(double t) {
        return new Color(x() * t, y() * t, z() * t);
    }

    public double linearToGamma(double linear_component){
        if(linear_component > 0){
            return Math.sqrt(linear_component);
        }

        return 0;
    }

    public static void writeColor(FileWriter writer, Color pixelColor) throws IOException {
        //clamp values between 0 to 1
        double r = Math.min(Math.max(pixelColor.x(), 0), 1);
        double g = Math.min(Math.max(pixelColor.y(), 0), 1);
        double b = Math.min(Math.max(pixelColor.z(), 0), 1);

        r = pixelColor.linearToGamma(r);
        g = pixelColor.linearToGamma(g);
        b = pixelColor.linearToGamma(b);

        Interval intensity = new Interval(0.000, 0.999);
        //translate 0,1 to byte range [0,255]
        int rByte = (int)(255.99 * intensity.clamp(r));
        int gByte = (int)(255.99 * intensity.clamp(g));
        int bByte = (int)(255.99 * intensity.clamp(b));

        //makes sure it stays in the range
        rByte = Math.min(Math.max(rByte, 0), 255);
        gByte = Math.min(Math.max(gByte, 0), 255);
        bByte = Math.min(Math.max(bByte, 0), 255);


        writer.write(rByte +" "+ gByte +" "+ bByte +"\n");
    }
}
