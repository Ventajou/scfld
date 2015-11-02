# scfld

Scfld is a simple project scaffolding tool. It relies on plugins to define the structure of projects.

You can use one of the plugins available in the npm registry or create your own that will best suit
your needs.

## Quick Start

Scfld is meant to be installed globally:

    npm i -g scfld

Next you need to [find a plugin](https://www.npmjs.com/search?q=scfld-) in the npm registry. Let's
say you want to scaffold a new plugin project, install `scfld-plugin`:

    npm i -g scfld-plugin

Now you're ready to create your first project. Create a new folder and from there run the following command:

    scfld init plugin

After answering a few questions, your new scfld plugin will be ready! You can test it by making it
available globally:

    npm link

Then create another empty folder and try out your new plugin

    scfld init <plugin name>
