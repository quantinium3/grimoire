import java.util.Random;

public class Vec3 {
    double[] e;

    Vec3() {
        this.e = new double[] { 0, 0, 0 };
    }

    Vec3(double e0, double e1, double e2) {
        this.e = new double[] { e0, e1, e2 };
    }

    public double x() {
        return e[0];
    }

    public double y() {
        return e[1];
    }

    public double z() {
        return e[2];
    }

    public Vec3 neg() {
        return new Vec3(-e[0], -e[1], -e[2]);
    }

    public double get(int i) {
        return e[i];
    }

    public void set(int i, double val) {
        e[i] = val;
    }

    public Vec3 add(Vec3 v) {
        return new Vec3(e[0] + v.e[0], e[1] + v.e[1], e[2] + v.e[2]);
    }

    public Vec3 sub(Vec3 v) {
        return new Vec3(e[0] - v.e[0], e[1] - v.e[1], e[2] - v.e[2]);
    }

    public Vec3 multiply(Vec3 v) {
        return new Vec3(e[0] * v.e[0], e[1] * v.e[1], e[2] * v.e[2]);
    }

    public Vec3 multiply(final double t) {
        return new Vec3(e[0] * t, e[1] * t, e[2] * t);
    }

    public Vec3 divide(final double t) {
        return this.multiply(1 / t);
    }

    public Vec3 multiplyInPlace(final double t) {
        this.e[0] *= t;
        this.e[1] *= t;
        this.e[2] *= t;
        return this;
    }

    public Vec3 divideInPlace(final double t) {
        return this.multiplyInPlace(1 / t);
    }

    public double length() {
        return Math.sqrt(lengthSquared());
    }
    public double lengthSquared() {
        return this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2];
    }

    public boolean nearZero() {
        final double s = 1e-8;
        return (Math.abs(e[0]) < s) && (Math.abs(e[1]) < s) && (Math.abs(e[2]) < s);
    }
    
    public static double dot(Vec3 u, Vec3 v) {
        return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
    }

    public static Vec3 cross(Vec3 u, Vec3 v) {
        return new Vec3(
            u.e[1] * v.e[2] - u.e[2] * v.e[1],
            u.e[2] * v.e[0] - u.e[0] * v.e[2],
            u.e[0] * v.e[1] - u.e[1] * v.e[0]
        );
    }

    public static Vec3 unitVector(Vec3 v) {
        return v.divide(v.length());
    }
}
