import React, {useEffect, useState} from 'react';
import {get, includes, isEmpty} from "lodash";
import {useStore} from "../../store";

export const hasAccess = (roleList = [], access = [],cant=[]) => {
    let hasAccessToRole = false;
    access.forEach((role)=>{
        if(includes(roleList,`${role}`)){
            hasAccessToRole = true
        }
    })
    cant.forEach((role)=>{
        if(includes(roleList,`${role}`)){
            hasAccessToRole = false
        }
    })
    return hasAccessToRole;
}
const HasAccess = ({
                       access = [],
                       cant = [],
                       children,
                   }) => {
    const [roles, setRoles] = useState([]);
    const user = useStore(state => get(state,'user',{}))

    useEffect(() => {
        if (!isEmpty(user)) {
            setRoles(get(user, 'roles', []));
        }
    }, [user])
    return (
        <>
            {hasAccess(roles,access,cant) ?  children : <></>}
        </>
    );
};

export default HasAccess;