export class Permission {
    _id: number;
    name: string;
    description: string;



    constructor(public id:number,
                public newName:string,
                public newDescription:string
                ){
        this._id=this.id;
        this.name=newName;
        this.description = newDescription;
    }

}
