<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-124185935-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-124185935-1');
    </script>
    <meta charset="utf-8">

    <title><?php echo $event->title ?></title>
    <meta property="og:title" content="<?php echo $event->title ?>"/>
    <meta property="og:description" content=""/>
    <meta property="og:url" content="<?php echo $domain . $url ?>"/>
    <meta property="og:type" content="website"/>
    <meta property="og:image" content="<?php echo $event->imageUrl ?>"/>
    <meta property="og:site_name" content="Fuiibi"/>

    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  </head>
  <body>
    <div id="fb-root"></div>
    <script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1'; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));</script>
    <div class="container">
      <div class="row">
        <figure class="col-md-12" class="max-height: 50vh;overflow: hidden;">
            <img style="object-fit: cover; height: 100%; width:100%;" alt="" src="<?php echo $event->imageUrl ?>">
        </figure>
        <div class="col-md-12">
          <h3><?php echo $event->title ?></h3>
          <div class="list-group">
            <div class="list-group-item">
              <h4 class="list-group-item-heading">
<i class="material-icons">place</i>
<?php echo $event->location->locality ?>
              </h4>
            </div>
            <div class="list-group-item">
              <h4 class="list-group-item-heading glyphicon glyphicon-time">
<i class="material-icons">access_time</i>
<?php echo $event->date ?>
              </h4>
            </div>
            <div class="list-group-item">
              <h4 class="list-group-item-heading glyphicon glyphicon-user">
<i class="material-icons">supervisor_account</i>
<?php printf("%d fuiibers were there", count((array)$event->users)) ?>
              </h4>
            </div>
            <div class="list-group-item">
              <h4 class="list-group-item-heading glyphicon glyphicon-user">
Register to see the whole event and share own experience
              </h4>
              <p><a class="btn btn-primary" href="https://www.fuiibi.com" role="button">I WAS THERE</a></p>
            </div>
          </div>
        </div>
        <div id="eventimages" class="carousel slide carousel-fade col-md-12" data-ride="carousel">
          <div class="carousel-inner">
<?php 
$images = array_values((array)$event->pictures);
$lastimage = end($images);
reset($images);
foreach(array_slice($images,1,5) as $i=>$image) { 
?>
            <div class="carousel-item <?php echo ($i==0 ? 'active' : '') ?>">
              <img src="<?php echo $image->imageUrl ?>" class="d-block w-100" alt="...">
            </div>
<?php } ?>
            <div class="carousel-item">
              <img src="<?php echo $lastimage->imageUrl ?>" class="d-block w-100" >
              <div class="carousel-caption">
<div class="alert alert-primary">
<h5 class=alert-heading><?php printf("%d more images in this event", count($images)) ?></h5>
<p>Register to <a href="/">see them all</a></p>
</div>
              </div>
            </div>
          </div>
          <a class="carousel-control-prev" href="#eventimages" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#eventimages" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<style></style>
  </body>
</html>
