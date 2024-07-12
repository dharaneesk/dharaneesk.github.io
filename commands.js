
var url_lin = "https://www.linkedin.com/in/dharaneeshwarsk";
var url_git = 'https://github.com/dharaneesk';
var url_yt = 'https://www.youtube.com/channel/UCfDR-EmpGUbhMIeOsC043uQ';
var url_mail = 'mailto:skdharaneeshwar@gmail.com';

var credits = 'Please refresh to begin another session.';

let commands = {
    resume: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;resume<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Take a look at my resume.<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("resume").help();
            }

            this.stdout("Compiling project list...<br>Opening resume.pdf");
            window.open('https://drive.google.com/file/d/14PKS1EwFq3jlaFvGMqZw9c9zWGAR_XRK/view?usp=sharing', '_blank');
            return true;
        }
    },
    github: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;github<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Visit my github profile.<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("github").help();
            }

            this.stdout("Redirecting to " + url_git);
            window.open(url_git, '_blank');
            return true;
        }
    },
    contact: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;contact METHOD<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Contact me through any of the following methods.<br>' +
                '<table class=man-table>' +
                '<tr><td>-lin&emsp;&emsp;&emsp;</td><td>LinkedIn</td></tr>' +
                '<tr><td>-m&emsp;&emsp;&emsp;</td><td>Mail</td></tr>' +
                '</table>';
        },

        callback: function (args) {
            let site = args[0];
            if (args.length !== 1 || site[0] !== '-') {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("contact").help();
            }

            site = site.slice(1);
            switch (site) {
                case "lin":
                    this.stdout("Redirecting to " + url_lin +"...");
                    window.open(url_lin, '_blank');
                    break;
                case "m":
                    this.stdout("Drafting mail to skdharaneeshwar@gmail.com...");
                    window.open(url_mail, '_blank');
                    break;
                default:
                    this.stderr("error: unsupported method");
                    break;
            }
            return true;
        },
    },
    yt: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;yt<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Visit my youtube channel. ;)<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("github").help();
            }

            this.stdout("Redirecting to my YT channel");
            window.open(url_yt, '_blank');
            return true;
        }
    },
    showerthought: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;showerthought<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Display a random r/ShowerThoughts post<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("showerthought").help();
            }

            this.stdout("Fetching ShowerThought...<br>");
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "resources/showerthoughts", false);
            window.scrollTo(0, document.body.scrollHeight);
            xmlhttp.send(null);
            if (xmlhttp.status == 200 || xmlhttp.status == 0) {
                let thoughts = xmlhttp.responseText.split('%');
                let random_index = Math.floor(Math.random() * (thoughts.length));
                thoughts = thoughts[random_index].split('\t')
                this.stdout(thoughts[0] + '<br>');
                this.stdout(`<span style='color:var(--terminal-magenta);'>&emsp;&emsp;&emsp;${thoughts[1]}</span>`);
            } else {
                console.log(xmlhttp.status)
                this.stderr("<span style='color:var(--terminal-red);'>Error: Something went wrong. Try Again</span>");
            }

            return true;
        }
    },
    ls: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;ls<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Print the files of the specified path.<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("ls").help();
            }

            let stdout = "about_me.txt"
            return stdout;
        }
    },
    cat: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;cat FILE<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Print the contents of the specified file.<br>';
        },

        callback: function (args) {
            if (args.length !== 1) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("cat").help();
            }

            let file = args[0];

            if (file == "about_me.txt") {
                let stdout = "<span class='text-df'><span class='text-quote'>\"Hello there\" - Obiwan Kenobi</span><br>I'm <span class='text-highlight'>Dharaneeshwar S K</span>, a <span class='text-highlight'>CSE grad from <a class='hyperlink' href='https://www.buffalo.edu' target='_blank'>SUNY Buffalo</a></span>.I previously worked as a <span class='text-highlight'>Software Engineer 2 at Citi</span>, and I love to writeoptimised code and make applications go brr. Currently interested in <span class='text-highlight'>ML/CV</span> projects.To know more about me, take a look at my resume with the <span class='highlight'><a class='hyperlink'href='https://drive.google.com/file/d/14PKS1EwFq3jlaFvGMqZw9c9zWGAR_XRK/view?usp=sharing' target='_blank'>'resume'</a></span> command.Checkout my projects on github, by executing the <span class='highlight'><a class='hyperlink' href='https://github.com/dharaneesk'target='_blank'>'github'</a></span>command. Hit the follow! Exciting things coming ahead! ;)If you wish to connect with me, use the <span class='highlight'><a class='hyperlink'href='https://www.linkedin.com/in/dharaneeshwarsk' target='_blank'>'contact'</a></span> commandto reach out.To learn the different shell commands use the <span class='highlight'>'help'</span> command.If you have nothing else to do on the site, you can <span class='highlight'>'exit'</span>.</span>"
                return stdout;
            }

            this.stderr("The file requested does not exist.");
            return true;
        }
    },
    clear: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;clear<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Clear the terminal screen.';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("clear").help();
            }

            let terminal = document.getElementById("terminal");
            let options = document.getElementsByClassName("options").length;
            for (let index = 1; index < options; index++) {
                let node = document.getElementById("options" + index);
                terminal.removeChild(node);
            }

            this.current = 0;
            this.options = document.getElementById("default-options");
            this.setupCommandLine();
            return true;
        }
    },
    rm: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;rm [OPTIONS] FILE<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Remove the specified file.<br>';
        },

        callback: function (args) {
            if (args.length === 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("rm").help();
            }

            let file = args[args.length - 1];
            let opts = args.slice(0, -1);

            if (file == "/" && (opts.includes('-rf') || (opts.includes('-r') && opts.includes('-f')))) {
                this.stderr("I see what you did there.");
                return false;
            }

            this.stderr("You do not have sufficient permissions for the specified action.");
            return true;
        }
    },
    sudo: {
        callback: function (args) {
            this.stderr("Trying to pull a fast one on me, eh?");
            return true;
        }
    },
    help: {
        callback: function (args) {
            let keys = this.commands.keys();
            let stdout = '<strong>COMMAND LIST:</strong><br>';

            for (var i in keys) {
                if (keys[i] !== "sudo") {
                    stdout += `${keys[i]},&emsp;`;
                }
            };

            stdout = stdout.slice(0, -7);
            return stdout + "<br>";
        }
    },
    man: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;man [COMMAND]<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;A refence manual to give information about a specific command.<br>';
        },

        callback: function (args) {
            let stdin = args[0];
            let stdout = '';

            if (this.utils.isEmpty(stdin)) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("man").help();
            }

            // If command not in keys
            if (this.commands.exists(stdin)) {
                let command = this.commands.get(stdin);

                if (this.utils.hasProperty(command, 'help')) {
                    stdout += command['help']();
                } else {
                    console.log("man");
                    this.stderr(`No manual entry for ${stdin}`);
                    return false;
                }
            } else {
                this.stderr(`No manual entry for ${stdin}`);
                return false;
            }

            return stdout;
        }
    },
    exit: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;exit<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Exit from the current shell.<br>';
        },

        callback: function (args) {

            if (args.length !== 0) {
                this.stderr("<span style='color:var(--terminal-red);'>Incorrect Usage</span><br>");
                return this.commands.get("exit").help();
            }

            var footnote = document.createElement("p");
            footnote.id = "footnote";
            footnote.innerHTML = credits;
            document.getElementById("terminal").appendChild(footnote);
            return true;
        }
    }
}
