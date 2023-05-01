import { createElement, ClassAttributes } from 'react';
import * as ReactDOM from 'react-dom';

import {
    Workspace, WorkspaceProps, SparqlDataProvider, SparqlQueryMethod, OWLRDFSSettings
} from '../src/graph-explorer/index';

import { onPageLoad, tryLoadLayoutFromLocalStorage, saveLayoutToLocalStorage } from './common';

// const ConfigData: any = require('../auth_config.json')
const ConfigData = { } ;

function onWorkspaceMounted(workspace: Workspace) {
    if (!workspace) { return; }

    const diagram = tryLoadLayoutFromLocalStorage();

    workspace.getModel().importLayout({
        diagram,
        validateLinks: true,
        dataProvider: new SparqlDataProvider({
            //endpointUrl: 'http://10.0.0.119:7200/repositories/datahub?infer=false',
            endpointUrl: 'http://localhost:3030/dataService/sparql',
            queryMethod: SparqlQueryMethod.GET,
            //acceptBlankNodes: true,
            //NH 30-7-2021 - custom header implementation
            headers: ConfigData,
            //queryFunction: qf
        }, //SparqlSettings 
        ),
    });
};

const props: WorkspaceProps & ClassAttributes<Workspace> = {
    ref: onWorkspaceMounted,
    onSaveDiagram: workspace => {
        const diagram = workspace.getModel().exportLayout();
        window.location.hash = saveLayoutToLocalStorage(diagram);
        window.location.reload();
    },
    viewOptions: {
        onIriClick: ({iri}) => window.open(iri),
    },
    languages: [
        {code: 'nl', label: 'Nederlands'},
    ],
    language: 'nl'
};

onPageLoad((container) => {
    ReactDOM.render(createElement(Workspace, props), container);
});
