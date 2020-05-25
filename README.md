<div style="text-align: center">
  <img src="./logo.png"/>
</div>

# Lightfold - lightweight scaffolding and archiving tool.

I built lightfold as a lightweight variant to more powerful but more complex tools such as Yeoman which are overkill for personal use. Lightfold allows users to simply and quickly zip archive a directory, and at a later date, that archive can be deployed to another location. There is also support to run custom code after unzipping for additional customization logic. This makes it easy to quickly build custom project scaffolds or starter code without having to deep-dive into the complexities of making a generator.

## Setup

#### Prerequisites

This tool relies on **Node.js**, recommended with **v12** and above. Older versions will likely still work but would have been untested.

Recommended setup is to go to [https://nodejs.org/en/](https://nodejs.org/en/) and download the **LTS** version.

This tool is a command line interface (CLI), therefore relies on a terminal to interact with. Supported terminals are:

- Mac OS:
  - Terminal.app
  - iTerm
- Windows:
  - cmd.exe
  - Powershell
  - Cygwin
- Linux (Ubuntu, openSUSE, Arch Linux, etc):
  - gnome-terminal (Terminal GNOME)
  - konsole

Note, lightfold's underlying interaction provider (*inquirer.js*) has posted a note about windows support:

> Running Inquirer together with network streams in Windows platform inside some terminals can result in process hang. Workaround: run inside another terminal. Please refer to the [https://github.com/nodejs/node/issues/21771](https://github.com/nodejs/node/issues/21771)

#### Installation

This utility is distributed through the **Node package manager**. With **Node** installed, you can install by running in your terminal:  
`npm install -g lightfold`

Alternatively, if you are comfortable with NPM, you can choose to download the source code, install relevant dependencies with `npm install` and install the CLI with `npm link`. 

This will install lightfold as a global package. After installation, you should be able to call `lfold -v` to see the current version. For example:

```
andrewxia@MacBook example % lfold --version
v1.0.0
```

If you are not able to see the expected response, please ensure npm packages are on your system's path. Additional information can be found here: [https://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm](https://www.tutorialspoint.com/nodejs/nodejs_environment_setup.htm)

## Usage

Lightfold revolves around the idea of **folds**. A **fold** is essentially a zipped up directory stored in the user directory on your computer. **Folds** can be easily deployed from the user directory to a location of the users choice by referencing its name.

To create a fold, a configuration file, **lightfold.json**, must exist in the root of the directory intending to be folded. The file can be initialized with `lfold init`. Users can choose to ignore files or directories so that they are not zipped by running `lfold ignore <path>` where `<path>` is the relative path from the working directory. By default, **lightfold.json** will be ignored.

To unfold a fold, simply run `lfold unfold <fold> [name]` where `<fold>` is the name of the fold you would like to unfold and `[name]` is the optional name of the output directory, the name of the fold will be used by default if name is not provided.

If custom logic is desired, then a generator can be used. `lfold generator` will create a generator that will be called after the fold is unfolded. The generator will consist of a **index.js** file, in which a function stub is created. The function stub is the entry point for the generator and is how lightfold will execute the generator. If addtional dependencies are required, a **package.json** is created. **Note:** lightfold will not install dependencies in the unfolding process thus **all generator dependencies should be folded with the generator**.

## Commands

`lfold init` - initializes the current working directory with a **lightfold.json** file.  
`lfold info [fold]` - get configuration for [fold], if [fold] is not given and command is executed in an initialized directory, then the contents of **lightfold.json** will be shown.  
`lfold ignore <path>` - add path to ignore list, note the path should be relative from current working directory.  
`lfold attend <path>` - remove path from ignore list, note the path should be relative from current working directory.  
`lfold generator [name]` - add a generator to fold, if name is provided than that will be the name of the generator, else a name will be asked for during the creation process.

`lfold fold` - package the current directory into a fold you can use later.  
`lfold list` - list available folds you can unfold.  
`lfold delete <fold>` - delete fold from list  
`lfold unfold <fold> [name]` - unfold an available fold into the current working directory. If name is provided, then the output directory will take that name, else the fold name will be used. If the fold was associated with a generator, the generator will be executed after unfolding and the generator will be deleted after execution.

## Example Workflow

We will walk through the steps to create your own fold. For this example, I have created a stripped down React starter app, the same that is in the **examples** directory. It is a modified version of the output from *create-react-app*, in which I remove unnecessary images, components and comments while also adding Sass support.

#### 1. init

To create your own fold, navigate to the directory you would like to fold.  
Run `lfold init`, you will be prompted for a name and description. My output is as follows

```
andrewxia@MacBook example % lfold init
initializing /Users/andrewxia/Documents/work/lightfold/example
? What would you like to name the fold? bare-react-app
? Add a description for the fold? a bare bones version of create-react-app
? Set a version identifier? 0.0.1
✅ fold initialized, configuration file at 'lightfold.json'
{
  name: 'bare-react-app',
  description: 'a bare bones version of create-react-app',
  ignore: [ 'lightfold.json' ],
  version: '0.0.1'
}
```

#### 2. ignore

Optionally, you can add files to the ignore list. I prefer doing this for *node_modules* and *package-lock.json*. You can do this with `lfold ignore node_modules` and `lfold ignore package-lock.json`.

```
andrewxia@MacBook example % lfold ignore node_modules
✅ added 'node_modules' to ignore list
andrewxia@MacBook example % lfold ignore package-lock.json
✅ added 'package-lock.json' to ignore list
```

#### 3. generator

Optionally, you can also add a generator to execute custom logic by running `lfold generator`. For this example, I want to create a generator that will template in the name and description of the app I am creating into *index.html*, *package.json* and *manifest.json*. I created a generator by:

```
andrewxia@MacBook example % lfold generator
? What would you like to name the folder that will hold the generator? lightfold-generator
✅ generator created at 'lightfold-generator'
```

Note that generators will need to be **folded with all required dependencies** therefore, I will first install some libraries that the generator will need.

```
andrewxia@MacBook lightfold-generator % npm install handlebars inquirer
+ inquirer@7.1.0
+ handlebars@4.7.6
added 42 packages from 68 contributors and audited 42 packages in 4.302s

4 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

From here, I can now implement the generator in the **index.js** file. For brevity, I won't include the code in this document but feel free to take a look at **/examples/index.js**.

#### 4. fold

Fold your directory by simply running `lfold fold`. My outputs were:

```
andrewxia@MacBook example % lfold fold
folding /Users/andrewxia/Documents/work/lightfold/example
folding lightfold-generator/index.js
folding lightfold-generator/package.json
folding package.json
folding public/index.html
folding public/manifest.json
folding public/robots.txt
folding src/index.js
folding src/serviceWorker.js
folding src/styles/index.scss
✅ created fold: bare-react-app
{
  name: 'bare-react-app',
  createdTime: '2020-05-24T01:19:30Z',
  description: 'a bare bones version of create-react-app',
  version: '0.0.1',
  generator: 'lightfold-generator',
  packPath: '/Users/andrewxia/.lightfold/bare-react-app.zip'
}
```

#### 5. list / info / delete

To list all available folds, you can use `lfold list`. In my case, I will see **bare-react-app** that we just created as well as another fold I created earlier named **app**

```
andrewxia@MacBook example % lfold list
ℹ️  available folds:
• app
• bare-react-app
```

To view info about a fold, you can use `lfold info [fold]`, for example:

```
andrewxia@MacBook example % lfold info bare-react-app
ℹ️  info for 'bare-react-app'
{
  name: 'bare-react-app',
  createdTime: 'May 23, 2020 9:19 PM',
  description: 'a bare bones version of create-react-app',
  version: '0.0.1',
  generator: 'lightfold-generator',
  packPath: '/Users/andrewxia/.lightfold/bare-react-app.zip'
}
```

To delete a fold, you can use `lfold delete <fold>`, for example, I will delete the **app** fold I had previously:

```
andrewxia@MacBook example % lfold delete app
? are you sure you want to delete app? Yes
✅ deleted 'app'
```

#### 6. unfold

To use the fold you have created, simply use `lfold unfold bare-react-app new-project`. Generators will be executed after the files are unzipped, for our example, because of our generator, additional promps will appear for the name and description of the project:

```
andrewxia@MacBook testGrounds % lfold unfold bare-react-app new-project
ℹ️  unfolding 'bare-react-app' to 'new-project'
? what would you like to name the project? new-project
? what is a short description of the project? a example new project using lightfold
✅ ran generator lightfold-generator
✅ unfolded 'bare-react-app' to '/Users/andrewxia/Documents/work/lightfold/testGrounds/new-project'
```

## Lightfold Cloud

If you want to store your folds in cloud storage or share them with your team. Shoot me an email at me (at) andrewxia.com for details.

## Contributing

Pull requests are welcome! For major changes, please make an issue first for discussion.  
**Also, feel free to open issues for feature requests!**

#### Under the hood

Behind the scenes, what is happening is simple. Given a directory, we zip up that directory and store it in the user directory as provided by `OS.homedir()`. An entry is also added to a global inventory file, in which metadata for folds are stored. Generators are executed by "requiring" the entry point and calling it wit the appropriate parameters.

#### Code Explanation

The entry point is **index.js**, using *Commander* to process command line arguments. Commands are processed by the appropriate functions in the **commands** directory. Core functions are stored in the **common** directory, containing logic for folding, interacting with **lightfold.json** as well as command line messaging (using *inquirer* and *chalk*)

## Built With

| Name       | Version | Link                                                                                           |
| ---------- | ------- | ---------------------------------------------------------------------------------------------- |
| adm-zip    | 0.4.14  | [https://github.com/cthackers/adm-zip](https://github.com/cthackers/adm-zip)                   |
| chalk      | 4.0.0   | [https://github.com/chalk/chalk](https://github.com/chalk/chalk)                               |
| commander  | 5.1.0   | [https://github.com/tj/commander.js/](https://github.com/tj/commander.js/)                     |
| esm        | 3.2.25  | [https://github.com/standard-things/esm](https://github.com/standard-things/esm)               |
| fs-extra   | 9.0.0   | [https://github.com/jprichardson/node-fs-extra](https://github.com/jprichardson/node-fs-extra) |
| inquirer   | 7.1.0   | [https://github.com/SBoudrias/Inquirer.js](https://github.com/SBoudrias/Inquirer.js)           |
| moment     | 2.25.3  | [https://github.com/moment/moment/](https://github.com/moment/moment/)                         |
| node-emoji | 1.10.0  | [https://github.com/omnidan/node-emoji](https://github.com/omnidan/node-emoji)                 |
| rimraf     | 3.0.2   | [https://github.com/isaacs/rimraf](https://github.com/isaacs/rimraf)                           |

## License

licensed under **GNU General Public License v3.0**

If you are able to do so, let me know what you're using the tool for. I built this tool solely for my own needs so I'm curious to see what use-cases you come up with.

## Author

Andrew Xia - me (at) andrewxia.com.  
Technologist in Toronto, Canada
