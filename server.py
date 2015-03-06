import os
import posixpath
import urllib

import SimpleHTTPServer
import SocketServer

import json

import re
import urlparse
import base64


PORT = 8000

ROUTES = (
    ['/images', 'workspace/images'],
    ['', '.']
)


def visible(filename):
    return not filename.startswith('.')

def get_ls(path):
    if os.path.isdir(path):
        return {
            "id" : path,
            "text" : path.split('/')[-1],
            "img" : "icon-folder",
            "nodes" : [get_ls(os.path.join(path,x)) for x in filter(visible, os.listdir(path))],
            "type": "directory" }
    else:
        return {
            "id": path,
            "text": path.split('/')[-1],
            "img": "icon-page",
            "type": "file" }


class BossHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path.endswith(".model"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            f = open('.'+self.path, 'r')
            self.wfile.write(f.read().encode("UTF-8"))
            f.close()
        elif self.path.startswith("/ls"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(json.dumps({"nodes":get_ls('workspace')}).encode("UTF-8"))
        elif self.path.startswith("/rm"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            path = self.path[3:]
            print path
            command = 'rm workspace' + path
            print command
            os.system(command)
        elif self.path.startswith("/mv"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            path = self.path[3:]
            components = path.split(':')
            command = 'mv workspace' + components[0] + ' workspace/' + components[1]
            print command
            os.system(command)
        elif self.path.startswith("/mkdir"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            path = self.path[6:]
            components = path.split(':')
            command = 'mkdir -p workspace' + components[0]
            print command
            os.system(command)
        else:
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)


    def do_POST(self):
        length = int(self.headers.getheader('content-length'))
        qmap = urlparse.parse_qs(self.rfile.read(length))
        data = base64.b64decode(re.findall("base64,(.*)",
                qmap['data'][0])[0])

        filename = qmap['filename'][0]
        target_path = qmap['target_path'][0]

        if os.path.isdir(target_path):
            f = open(os.path.join(target_path, filename), 'w')
            f.write(data)
            f.close()

        self.send_response(200)


    def translate_path(self, path):
        if path.split('/')[0] == "ls":
            return path
        else:
            # set default root to cwd
            root = os.getcwd()

            # look up routes and set root directory accordingly
            for pattern, rootdir in ROUTES:
                if path.startswith(pattern):
                    path = path[len(pattern):]  # consume path up to pattern len
                    root = rootdir
                    break

            # normalize path and prepend root directory
            path = path.split('?',1)[0]
            path = path.split('#',1)[0]
            path = posixpath.normpath(urllib.unquote(path))

            words = path.split('/')
            words = filter(None, words)

            path = root
            for word in words:
                drive, word = os.path.splitdrive(word)
                head, word = os.path.split(word)
                if word in (os.curdir, os.pardir):
                    continue
                path = os.path.join(path, word)

            return path


def go():
    print "serving on port " + str(PORT)
    httpd = SocketServer.TCPServer(("", PORT), BossHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    go()




