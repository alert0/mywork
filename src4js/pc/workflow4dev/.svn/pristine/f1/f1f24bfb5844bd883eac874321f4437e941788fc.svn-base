import {WeaTools} from 'ecCom'

export const getQueryFieldsList = () => {
    return WeaTools.callApi('/api/workflow/search/condition');
}

export const queryFieldsSearch = (params) => {
    return WeaTools.callApi('/api/workflow/search/pagingresult', 'GET', params);
}

export const queryFieldsTree = (params) => {
    return WeaTools.callApi('/api/workflow/search/resulttree', 'GET', params);
}