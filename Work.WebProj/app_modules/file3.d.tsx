declare module __JCIN {

    interface KKK {
        id:number
    }

    class ContextComponent extends React.Component<KKK, any> {
        getManager(): any;
    }

}

declare module "JCIN" {
    export = __JCIN;
}