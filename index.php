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
$template = file_get_contents(__DIR__ . '/index.html');
if (!preg_match('~^/events/(.+)$~', $_SERVER['SCRIPT_URI'], $m)) {
  echo $template;
  die;
}
ini_set('display_errors', true);
error_reporting(E_ALL);

$ch = curl_init('https://iwtapplication.firebaseio.com' . $_SERVER['SCRIPT_URI'] . '.json');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($ch);
$event = json_decode($res);
if (is_null($event)) {
  header('HTTP/1.0 404 Not Found');
  die;
}
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
$out = preg_replace('~--ssr--~',$app,$out);
$out = preg_replace_callback('~<meta property="og:(title|description|url|image)" content=""/>~', function($m) {
  return "<meta property=\"og:{$m[1]}\" content=\"${m[1]}\" />"; 
}, $out);
echo $out;
