class HitRecord {
    public Vec3.Point3 p;
    public Vec3 normal;
    public Material mat;
    public double t;
    public boolean front_face;

    public void set(HitRecord oth) {
        this.p = new Vec3.Point3(oth.p);
        this.normal = new Vec3(oth.normal.x(), oth.normal.y(), oth.normal.z());
        this.mat = oth.mat;
        this.t = oth.t;
        this.front_face = oth.front_face;
    }

    public HitRecord() {
        this.p = new Vec3.Point3();
        this.normal = new Vec3();
        this.mat = null;
        this.t = 0;
        this.front_face = false;
    }

    public void setFaceNormal(Ray r, Vec3 outward_normal) {
        front_face = Vec3.dot(r.direction(), outward_normal) < 0;
        normal = front_face ? outward_normal : outward_normal.nega();
    }
}

public interface Hittable {
    boolean hit(Ray r, Interval rayT, HitRecord rec);
}
