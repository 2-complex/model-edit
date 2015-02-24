

#include "modelapp.h"

#include <string>
#include <stdlib.h>

using namespace g2c;
using namespace std;


ModelApp::ModelApp()
    : bank(NULL)
{
    cameraRadius = 20;
    cameraPhi = 0.5;
    cameraTheta = -0.25;

    firstX = 0;
    firstY = 0;
    firstTheta = 0;
    firstPhi = 0;
}

ModelApp::~ModelApp()
{
}

ModelApp* ModelApp::get()
{
    static ModelApp* instance = NULL;
    if( ! instance )
        instance = new ModelApp;
    return instance;
}



void ModelApp::setString(const char* inString)
{
    model.deserialize(inString);
}

void ModelApp::resize(int width, int height)
{
    projection = perspective(
        20.0,
        1.0 * width/height,
        0.1 * cameraRadius,
        1000 * cameraRadius );
}

void ModelApp::init()
{
}

Vec3 ModelApp::getCameraLoc() const
{
    return cameraLookAtLoc+
        cameraRadius*Vec3(
            cos(cameraTheta)*cos(cameraPhi),
            sin(cameraTheta)*cos(cameraPhi),
            sin(cameraPhi));
}

bool ModelApp::mouseDown(const Vec2& C)
{
    last = C;
    return true;
}

void ModelApp::mouseDragged(const Vec2& C)
{
    Vec2 delta = -0.01*(C - last);
    cameraTheta += delta.x;
    cameraPhi += delta.y;

    if(cameraPhi > 0.5*M_PI) cameraPhi = 0.5*M_PI;
    if(cameraPhi < -0.5*M_PI) cameraPhi = -0.5*M_PI;

    last = C;
}

void ModelApp::mouseUp(const Vec2& C)
{
    mouseDragged(C);
}

void ModelApp::setBank(Bank* inBank)
{
    bank = inBank;
    model.bank = bank;
}

void ModelApp::setCenter(const Vec3& V)
{
    cameraLookAtLoc = V;
}

Vec3 ModelApp::getLookAtLoc() const
{
    return cameraLookAtLoc;
}

void ModelApp::draw() const
{
    if( model.assumptions.find("context") == model.assumptions.end() )
        return;

    Assumption& context = *(model.assumptions["context"]);

    Mat4 world;
    Mat4 view = lookAt(getCameraLoc(), getLookAtLoc(), Vec3(0,0,1));

    context["model"] = world;
    context["viewProjection"] = projection * view;

    context["modelView"] = view * world;
    context["projection"] = projection;
    context["cameraPosition"] = getCameraLoc();

    model.draw();
}

