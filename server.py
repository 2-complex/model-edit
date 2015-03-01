import os
import posixpath
import urllib

import SimpleHTTPServer
import SocketServer

import json

PORT = 8000

ROUTES = (
    ['/assets', 'workspace/images'],
    ['', '.']
)


def get_ls(path):
    if os.path.isdir(path):
        return {
            "id" : "fs-" + path,
            "text" : path.split('/')[-1],
            "img" : "icon-folder",
            "nodes" : [get_ls(os.path.join(path,x)) for x in os.listdir(path)] }
    else:
        return {
            "id": "fs-" + path,
            "text": path.split('/')[-1],
            "img": "icon-page" }


lsstring = """
{\"nodes\":[
    { \"id\": \"fromserver-2\", \"text\": \"assets\", \"img\": \"icon-folder\", \"expanded\": true, \"group\": true,
      \"nodes\": [ { \"id\": \"fromserver-2-1\", \"text\": \"fromserver 2.1\", \"img\": \"icon-folder\",
                 \"nodes\": [
                   { \"id\": \"fromserver-2-1-1\", \"text\": \"fromserver 2.1.1\", \"img\": \"icon-page\", \"count\": \"4\", \"route\": \"/some/:id/:vid\"},
                   { \"id\": \"fromserver-2-1-2\", \"text\": \"fromserver 2.1.2\", \"img\": \"icon-page\", \"count\": \"10\", \"route\": \"/some/:id/:vid/ok\" },
                   { \"id\": \"fromserver-2-1-3\", \"text\": \"fromserver 2.1.3\", \"img\": \"icon-page\", \"count\": \"22\", \"route\": \"/some/:id/:vid,:id\" },
                   { \"id\": \"fromserver-2-1-4\", \"text\": \"fromserver 2.1.4\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-5\", \"text\": \"fromserver 2.1.5\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-6\", \"text\": \"fromserver 2.1.6\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-7\", \"text\": \"fromserver 2.1.7\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-8\", \"text\": \"fromserver 2.1.7\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-9\", \"text\": \"fromserver 2.1.7\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-10\", \"text\": \"fromserver 2.1.10\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-11\", \"text\": \"fromserver 2.1.11\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-12\", \"text\": \"fromserver 2.1.12\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-13\", \"text\": \"fromserver 2.1.13\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-14\", \"text\": \"fromserver 2.1.14\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-2-1-15\", \"text\": \"fromserver 2.1.15\", \"img\": \"icon-page\" }
             ]},
               { \"id\": \"fromserver-3-1\", \"text\": \"fromserver 3.1\", \"img\": \"icon-folder\", \"expanded\": true,
                 \"nodes\": [
                   { \"id\": \"fromserver-3-1-1\", \"text\": \"fromserver 3.1.1\", \"icon\": \"fa-beer\", \"disabled\": true },
                   { \"id\": \"fromserver-3-1-2\", \"text\": \"fromserver 3.1.2\", \"icon\": \"fa-envelope\" },
                   { \"id\": \"fromserver-3-1-3\", \"text\": \"fromserver 3.1.3\", \"icon\": \"fa-ok\" },
                   { \"id\": \"fromserver-3-1-4\", \"text\": \"fromserver 3.1.4\", \"icon\": \"fa-heart\" },
                   { \"id\": \"fromserver-3-1-5\", \"text\": \"fromserver 3.1.5\", \"icon\": \"fa-globe\", \"disabled\": true },
                   { \"id\": \"fromserver-3-1-6\", \"text\": \"fromserver 3.1.6\", \"icon\": \"fa-reorder\" },
                   { \"id\": \"fromserver-3-1-7\", \"text\": \"fromserver 3.1.7\", \"icon\": \"fa-user-md\" },
                   { \"id\": \"fromserver-3-1-8\", \"text\": \"fromserver 3.1.8\", \"icon\": \"fa-download\" }
             ]},
               { \"id\": \"fromserver-4-1\", \"text\": \"fromserver 4.1\", \"img\": \"icon-folder\",
                 \"nodes\": [
                   { \"id\": \"fromserver-4-1-1\", \"text\": \"fromserver 4.1.1\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-4-1-2\", \"text\": \"fromserver 4.1.2\", \"img\": \"icon-page\" },
                   { \"id\": \"fromserver-4-1-3\", \"text\": \"fromserver 4.1.3\", \"img\": \"icon-page\" }
             ]}
             ]
    },
    { \"id\": \"fromserver-5\", \"text\": \"fromserver 5\", \"img\": \"icon-folder\", \"expanded\": true, \"group\": true,
      \"nodes\": [ { \"id\": \"fromserver-5-1\", \"text\": \"fromserver 5.1\", \"img\": \"icon-page\" },
               { \"id\": \"fromserver-5-2\", \"text\": \"fromserver 5.2\", \"img\": \"icon-page\" },
               { \"id\": \"fromserver-5-3\", \"text\": \"fromserver 5.3\", \"img\": \"icon-page\" }
             ]
    }
]}
"""




class BossHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_HEAD(self):
        if self.path.startswith("/ls"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
        else:
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_HEAD(self)


    def do_GET(self):
        if self.path.startswith("/ls"):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(json.dumps({"nodes":get_ls('workspace')}).encode("UTF-8"))
        else:
            return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

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




