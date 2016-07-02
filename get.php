<?php
require 'vendor/autoload.php';

$client = \Doctrine\CouchDB\CouchDBClient::create(array('dbname' => 'pokedex'));

$pokemon = $_GET['name'];

$query = $client->createViewQuery('pokemon', 'by_name');
$query->setKey($pokemon);
$query->setReduce(false);
$query->setIncludeDocs(true);
$result = $query->execute();

if(!empty($result[0])){

    $data = $result[0];
    echo json_encode($data);

}else{
    $result = array('no_result' => true);
    echo json_encode($result);
}
?>