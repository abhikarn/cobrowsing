
// export class CobrowsingSessionStorageService
// {
//     private static cobrowsingSessionStorage:Storage;
    
//     //session
//     constructor()
//     {
//         if(Storage==null || Storage == undefined)
//            throw new Error("Storage is not supported by current browser");
//         else
//             cobrowsingSessionStorage = sessionStorage;
            
//     }

//     public static StoreInSession(key:string, value:string):void{
//        cobrowsingSessionStorage.setItem(key,value);
//     }

//     public static GetFromStore(key:string):string{
//       return  this.cobrowsingSessionStorage.getItem(key);
//     }

//     public static ClearStorage(){
//         this.cobrowsingSessionStorage.clear();
//     }

//     public static get Length():number{
//        return this.cobrowsingSessionStorage.length;
//     }
// }