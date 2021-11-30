import { TOKEN_SEPARATOR } from "../constants";
import { NamespaceSettings } from "../models";

export class Namespacer {

    private static instance: Namespacer = new Namespacer();
    
    private _namespaceSettings: NamespaceSettings | undefined;

    constructor(namespaceSettings?: NamespaceSettings) {
        this._namespaceSettings = namespaceSettings;
    }

    public static SetNamespace(namespaceSettings: NamespaceSettings) {
        this.instance = new Namespacer(namespaceSettings);
    }

    public static get Instance() {
        return this.instance;
    }

    public forClass(value: string){ 

        if(!this._namespaceSettings || this._namespaceSettings.classes === false){ 
            return value; 
        }

        return this.applyNamespace(this._namespaceSettings.classes, this._namespaceSettings.prefix, value);

    }

    public forVar(value: string) {
        if(!this._namespaceSettings || this._namespaceSettings.vars === false){ 
            return value; 
        }

        return this.applyNamespace(this._namespaceSettings.vars, this._namespaceSettings.prefix, value);
    }

    private applyNamespace(toApply: true | string | undefined, prefix: string, value: string) {

        let namespace: string;

        if(toApply === true || toApply === undefined){
            namespace = prefix;
        } else {
            namespace = toApply;
        }

        if(!namespace.endsWith(TOKEN_SEPARATOR)){
            namespace = namespace + TOKEN_SEPARATOR;
        }

        return namespace + value;
    }
}