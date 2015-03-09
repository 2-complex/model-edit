
#ifndef _ModelApp_
#define _ModelApp_

#include "app.h"
#include "graphics.h"

class ModelApp : public g2c::App
{
public:
    ModelApp();
    virtual ~ModelApp();

    g2c::Bank* bank;
    mutable g2c::Model model;

    void setCenter(const Vec3& V);
    void setBank(g2c::Bank* inBank);

    void init();
    void draw() const;

    void resize(int width, int height);
    bool mouseDown(const Vec2& C);
    void mouseDragged(const Vec2& C);
    void mouseUp(const Vec2& C);

    void mouseWheel(double delta);

    void setString(const char* inString);

    static ModelApp* get();

protected:
    /* getCameraLoc returns the current camera location in 3-space. */
    Vec3 getCameraLoc() const;
    Vec3 getLookAtLoc() const;

private:
    Mat4 projection;

    double cameraRadius;
    double cameraPhi;
    double cameraTheta;
    Vec3 cameraLookAtLoc;

    Vec2 last;
    double firstX;
    double firstY;
    double firstTheta;
    double firstPhi;
};

#endif

