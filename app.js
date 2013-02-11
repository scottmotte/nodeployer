var REPO      = process.env.REPO;

var express   = require('express')
  , http      = require('http')
  , path      = require('path')
  , exec      = require('child_process').exec;

var app       = express();

function puts(error, stdout, stderr) { sys.puts(stdout) }

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.send("nodeployer");
});

app.post('/', function(req, res) {
  var payload = req.body.payload;

  if (!payload) {
    res.send("Stop sending me rubbish");
  }

  var push = JSON.parse(payload);
  if (push['ref'] != 'refs/heads/master') {
    res.send("Not a push on master - ignorning.");
  }

  var repo = push['repository']['name'];

  
  exec("cd ~/repos/"+REPO, puts);
  exec("git pull origin master", puts);

  // Dir.chdir("/var/deployments/" + repo)
  // if (system("/bin/su", "deployment", "-c", "/usr/bin/git pull"))
  //   puts "git pull of #{repo} successful"
  //   if (system("/usr/bin/sv", "kill", "."))
  //    return "Restarted!"
  //   end
  // end

  res.send("nodeployer deploying your app!");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});