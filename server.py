import os
import posixpath
import urllib
import urllib2

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
            "nodes" : [get_ls(os.path.join(path,x)) for x in filter(visible, os.listdir(path))],
            "type": "directory" }
    else:
        return {
            "id": path,
            "text": path.split('/')[-1],
            "type": "file" }


def sanitize(path):
    path = urllib2.unquote(path)
    if path.startswith('/'):
        path = path[1:]
    if not path.startswith('workspace'):
        path = 'workspace/' + path

    components = path.split('/')
    for c in components:
        if c.startswith('.'):
            raise Exception("invalid path")

    return '"' + path + '"'

def execute_command(command):
    print "executing: " + command
    os.system(command)

class BossHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(self):
        try:
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
                path = sanitize(path)
                command = 'rm -rf ' + path # yikes !!!!!!!!!!!!!!
                execute_command(command)
            elif self.path.startswith("/mv"):
                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                paths = self.path[3:].split(':')
                paths = map(sanitize, paths)
                command = 'mv ' + paths[0] + ' ' + paths[1]
                execute_command(command)
            elif self.path.startswith("/mkdir"):
                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                path = self.path[6:]
                paths = path.split(':')
                paths = map(sanitize, paths)
                command = 'mkdir -p ' + paths[0]
                execute_command(command)
            else:
                return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)
        except:
            self.send_response(403)


    def do_POST(self):
        if self.path.startswith("/upload"):
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

        elif self.path.startswith("/git-init"):
            length = int(self.headers.getheader('content-length'))
            qmap = urlparse.parse_qs(self.rfile.read(length))

            git_url = qmap['git_url'][0]
            git_branch = qmap['git_branch'][0]
            git_token = qmap['git_token'][0]

            execute_command("rm -rf workspace")
            execute_command("mkdir workspace")
            os.chdir("workspace")
            execute_command("git init")
            execute_command("git remote add origin " + git_url.replace("://", "://" + git_token + "@"))
            execute_command("git pull origin master")
            os.chdir("..")

            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write('{"status":"success"}')

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




