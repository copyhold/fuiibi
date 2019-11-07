<?php
/*
 * if event page
 *  connect to firebase
 *  fetch event data
 *  get index.html and embed into it the event html and meta
 *  send to output
 * else
 *  send the index.html
 */
$domain = 'https://www.fuiibi.com';
$url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($_COOKIE['authuser'] && $_COOKIE['authuser']=='true') {
  echo file_get_contents(__DIR__ . '/index.html');
  die;
}
ini_set('display_errors', true);
error_reporting(E_ALL);

$ch = curl_init('https://fuiibi.firebaseio.com' . $url . '.json');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($ch);
$event = json_decode($res);
if (is_null($event)) {
  header('HTTP/1.0 404 Not Found');
  die;
}
require 'event.php';
die;
$template = file_get_contents(__DIR__ . '/event.html');
$images = '';
foreach($event->pictures as $picture) {
  $images .= '<img src="' . $picture->imageUrl .'" />';
}
$app = <<<EOA
<h1>{$event->title}</h1>
<date>{$event->date}</date>
<article>
  <p>{$event->description}</p>
  <figure>{$images}</figure>
</article>
EOA;
$out = str_replace('<title>', '<title>' . $event->title . ' | ', $template);
$out = preg_replace('~Loading...~',$app,$out);
$out = preg_replace_callback('~<meta property="og:(title|description|url|image)" content=""/>~', function($m) use ($event, $domain, $url) {
  switch ($m[1]) {
  case 'title':
    $repl = $event->title;
      break;
  case 'description': 
    $repl = $event->description;
    break;
  case 'image':
    $repl = $event->imageUrl;
    break;
  case 'url':
    $repl = $domain . $url;
    break;
  }
  return "<meta property=\"og:{$m[1]}\" content=\"{$repl}\" />"; 
}, $out);
echo $out;
