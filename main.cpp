
#include "modelapp.h"
#include "emscriptenbank.h"

#include <launch.h>

#include <stdio.h>

#include <SDL/SDL.h>

using namespace std;
using namespace g2c;


void initSDL(int width, int height)
{
    static bool initializedAlready = false;
    static SDL_Surface* screen = NULL;

    if( ! initializedAlready )
    {
        if( SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO | SDL_INIT_TIMER) == 0 )
        {
            screen = SDL_SetVideoMode(width, height, 0, SDL_OPENGL);
            if (screen == NULL)
            {
                printf("Could not set video mode: %s", SDL_GetError());
            }
        }
        else
        {
            printf("Could not initialize SDL: %s", SDL_GetError());
        }
        initializedAlready = true;
    }
}

extern "C" void setString(char* inString)
{
    ModelApp::get()->setString(inString);
}

extern "C" void mouseDown(double x, double y)
{
    ModelApp::get()->mouseDown(Vec2(x,y));
}

extern "C" void mouseDragged(double x, double y)
{
    ModelApp::get()->mouseDragged(Vec2(x,y));
}

extern "C" void mouseUp(double x, double y)
{
    ModelApp::get()->mouseUp(Vec2(x,y));
}

extern "C" void init()
{
    ModelApp::get()->setBank(new EmscriptenBank);
    ModelApp::get()->init();
}

extern "C" void resize(int width, int height)
{
    initSDL(width, height);

    glClearColor(1.0f, 0.0f, 1.0f, 1.0f);
    glViewport(0, 0, width, height);

    ModelApp::get()->resize(width, height);
}

extern "C" void step(double t)
{
    ModelApp::get()->step(t);
}

extern "C" void draw()
{
    ModelApp::get()->draw();
    SDL_GL_SwapBuffers();
}

