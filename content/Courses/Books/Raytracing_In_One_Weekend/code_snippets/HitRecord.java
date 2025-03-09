public class HitRecord {
    public Vec3 p;
    public Vec3 normal;
    public double t;
    public boolean frontFace;

    public void setFaceNormal(Ray r, Vec3 outwardNormal) {
        frontFace = Vec3.dot(r.direction(), outwardNormal) < 0;
        normal = frontFace ? outwardNormal : outwardNormal.neg();
    }

    public void copyFrom(HitRecord other) {
        this.p = other.p;
        this.normal = other.normal;
        this.t = other.t;
        this.frontFace = other.frontFace;
    }
}
