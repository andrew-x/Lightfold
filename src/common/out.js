import Chalk from "chalk";
import Inquirer from "inquirer";
import { emojify } from "node-emoji";

export const error = (...message) => {
  console.error(
    emojify(":heavy_exclamation_mark:"),
    Chalk.redBright.bold(...message)
  );
};

export const info = (...message) => {
  console.log(emojify(":information_source: "), ...message);
};

export const warn = (...message) => {
  console.log(
    emojify(":warning: "),
    Chalk.yellowBright.bold(...message)
  );
};

export const message = (...message) => {
  console.log(...message);
};

export const success = (...message) => {
  console.log(
    emojify(":white_check_mark:"),
    Chalk.greenBright.bold(...message)
  );
};

const _handleInquirerErr = (err) => {
  if (err.isTtyError) {
    error("this terminal is not supported");
  } else {
    error("something went wrong, please try again later");
  }
};

export const confirm = async (question) => {
  return new Promise((resolve, reject) =>
    Inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: question,
      },
    ])
      .then((answers) => resolve(answers["confirm"]))
      .catch((err) => {
        _handleInquirerErr(err);
        reject(err);
      })
  );
};

export const interrogate = async (questions) => {
  return new Promise((resolve, reject) => {
    Inquirer.prompt(
      questions.map((q) => ({
        type: "input",
        name: q.id,
        message: q.prompt,
        default: q.default,
        validate: q.validate,
      }))
    )
      .then((answers) => resolve(answers))
      .catch((err) => {
        _handleInquirerErr(err);
        reject(err);
      });
  });
};
