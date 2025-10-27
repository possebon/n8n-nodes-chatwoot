import {INodeType, INodeTypeDescription, INodeProperties} from 'n8n-workflow';
import {N8NPropertiesBuilder, N8NPropertiesBuilderConfig} from '@devlikeapro/n8n-openapi-node';
import * as doc from './openapi.json';

const config: N8NPropertiesBuilderConfig = {}
const parser = new N8NPropertiesBuilder(doc, config);
const generatedProperties = parser.build();

// Add a global Account ID field at the beginning that shows for all operations
const accountIdField: INodeProperties = {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    default: '',
    required: true,
    description: 'The Chatwoot account ID (required for multi-tenant setups)',
    placeholder: '1',
};

// Remove the auto-generated account_id fields and add our global one
const properties = [
    accountIdField,
    ...generatedProperties.filter(p => p.name !== 'account_id')
]

export class ChatWoot implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'ChatWoot',
        name: 'chatWoot',
        icon: 'file:chatwoot.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with ChatWoot API',
        defaults: {
            name: 'ChatWoot',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'chatwootApi',
                required: true,
            },
        ],
        requestDefaults: {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            baseURL: '={{$credentials.url}}/api/v1/accounts/{{$parameter["accountId"]}}',
        },
        properties: properties,
    };
}
