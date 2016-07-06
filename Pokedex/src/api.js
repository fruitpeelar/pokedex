module.exports = function(pokemon){

    var url = 'http://192.168.xxx.xxx/pokedex/get.php?name=' + pokemon;

    return fetch(url).then(function(response){
        return response.json();
    }).then(function(json){
        return json;
    });
}