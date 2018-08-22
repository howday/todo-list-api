
'use strict';

const todoQueryParser = function parse(query) {
    let pagination = {};
    let sort = {};
    if(query.sort && query.order){
        sort[query.sort] = query.order;
    }else{
        sort['name'] = 'asc';
    }
    pagination['sortOrder'] = sort;
    pagination['limit'] = parseInt(query.max);
    pagination['offset'] = pagination['limit'] * parseInt(query.offset);
    return pagination;


};

module.exports = todoQueryParser;


