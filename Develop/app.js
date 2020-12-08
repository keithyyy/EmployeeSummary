const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
// const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const startApp = () => {
    getInfo();
};
// Empty array of team member to start.
let team = [];

// questions to get team member info.
function getInfo() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Team member name:",
            validate: nameValue => {
                if (nameValue) {
                    return true;
                } else {
                    console.log("Please enter a name!");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "id",
            message: "Assign team member an ID:",
            validate: idValue => {
                if (idValue) {
                    return true;
                } else {
                    console.log("Please enter an ID!")
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "email",
            message: "Team member's email?",
            validate: emailValue => {
                if (emailValue) {
                    return true;
                } else {
                    console.log("Please enter an email!")
                    return false;
                }
            }
        },
        {
            type: "list",
            name: "role",
            message: "What's this team member's role?",
            choices: ["Manager", "Engineer", "Intern", "Other"]
        }

    ])
    .then(answers => {

        if (answers.role === "Manager") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "office",
                    message: "What is their assigned office number?",
                    validate: officeValue => {
                        if (officeValue) {
                            return true;
                        } else {
                            console.log("Please enter an office number.")
                            return false;
                        };
                    }
                }
            ])
            .then(response => {
                console.log(response.office)

                const employeeManager = new Manager(answers.name, answers.id, answers.email, answers.role, response.office);
                team.push(employeeManager);
                addAnother();
            })
        } else if (answers.role === "Engineer") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "gitHub",
                    message: "What's their Github username?",
                    validate: gitHubValue => {
                        if (gitHubValue) {
                            return true;
                        } else {
                            console.log("Please enter a GitHub username");
                            return false;
                        }
                    }

                }
            ])
            .then(response => {
                console.log(response.gitHub)

                const employeeEngineer = new Engineer(answers.name, answers.id, answers.email, answers.role, response.gitHub);
                team.push(employeeEngineer)
                addAnother();
            })
        } else if (answers.role === "Intern") {
            inquirer.prompt([
                {
                    type: "input",
                    name: "school",
                    message: "What school do they currently attend?",
                    validate: school => {
                        if (school) {
                            return true;
                        } else {
                            console.log("Please enter a school.")
                            return false;
                        }
                    }
                }
            ])
            .then(response => {
                console.log(response.school);

                const employeeIntern = new Intern(answers.name, answers.id, answers.email, answers.role, response.school);
                team.push(employeeIntern)
                addAnother()
            })
        } else {
            const employeeOther = new Employee (answers.name, answers.id, answers.email, answers.role);
            
            team.push(employeeOther);
            addAnother()

        }
        function addAnother() {
            inquirer.prompt([
                {
                    type: "confirm",
                    name: "addMore",
                    message: "Would you like to add another member?"
                }
            ])
            .then(choice => {
                if (choice.addMore === true){
                    getInfo(team)
                } else {
                    console.log("Team roster: ", team)
                    askTeamName();
                
                }
            })
        } 
    })
}

const teamNameQuestion = {
    type: "input",
    name: "teamName",
    message: "Enter your team name:",
    validate: teamName => {
        if (teamName) {
            return true;
        } else {
            console.log("Invalid! Please enter a team name.");
            return false;
        }
    }
}

const askTeamName = () => {
    inquirer.prompt(teamNameQuestion).then(ans => {
        if (ans.teamName) {
            createTeam(ans.teamName);
        } else {
            askTeamName();
        }
    })
}

const createTeam = (teamName) => {
    const outputPath = path.join(OUTPUT_DIR, teamName + "team.html");

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR)
    }

    fs.writeFileSync(outputPath, render(team), (err) => {
        if (err) {
            console.log(err);
            
        }
    })
}

startApp();
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
