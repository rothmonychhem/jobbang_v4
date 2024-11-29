import { createContext, useReducer } from "react";

export const EmploiContext = createContext()

 export const emploiReducer = (state, action) => {

    switch (action.type){
        case 'SET_EMPLOIS':
            return {
                emplois: action.payload
            }
        case 'CREATE_EMPLOIS':
            console.log("createEmploi")
            return {
                emplois: [action.payload, ...state.emplois]
            }
        case 'DELETE_EMPLOIS':
            return {
              emplois: state.emplois.filter(
                (e) => e._id !== action.payload._id
              ),
            };
        case 'UPDATE_EMPLOIS':
            return {
                emplois: state.emplois.map((emploi) =>
                    emploi._id === action.payload._id ? action.payload : emploi
                  )};
                    
                   
        default :
        return state
    }
 }


export const EmploiContextProvider =({children}) => {
    
    const [state,dispatch] = useReducer(emploiReducer, {
        emplois:null
    })
 
  

    return(
        <EmploiContext.Provider value={{...state, dispatch}}>
                {children}
        </EmploiContext.Provider>
    )
}
