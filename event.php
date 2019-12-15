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
    <link href='https://fonts.googleapis.com/css?family=Marck Script|Roboto' rel='stylesheet'>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<?php echo file_get_contents(__DIR__ . '/assets-map.html') ?>
   <style type="text/css">.fb_hidden{position:absolute;top:-10000px;z-index:10001}.fb_reposition{overflow:hidden;position:relative}.fb_invisible{display:none}.fb_reset{background:none;border:0;border-spacing:0;color:#000;cursor:auto;direction:ltr;font-family:"lucida grande", tahoma, verdana, arial, sans-serif;font-size:11px;font-style:normal;font-variant:normal;font-weight:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal}.fb_reset>div{overflow:hidden}@keyframes fb_transform{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.fb_animate{animation:fb_transform .3s forwards}
.fb_dialog{background:rgba(82, 82, 82, .7);position:absolute;top:-10000px;z-index:10001}.fb_dialog_advanced{border-radius:8px;padding:10px}.fb_dialog_content{background:#fff;color:#373737}.fb_dialog_close_icon{background:url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 0 transparent;cursor:pointer;display:block;height:15px;position:absolute;right:18px;top:17px;width:15px}.fb_dialog_mobile .fb_dialog_close_icon{left:5px;right:auto;top:5px}.fb_dialog_padding{background-color:transparent;position:absolute;width:1px;z-index:-1}.fb_dialog_close_icon:hover{background:url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 -15px transparent}.fb_dialog_close_icon:active{background:url(https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/IE9JII6Z1Ys.png) no-repeat scroll 0 -30px transparent}.fb_dialog_iframe{line-height:0}.fb_dialog_content .dialog_title{background:#6d84b4;border:1px solid #365899;color:#fff;font-size:14px;font-weight:bold;margin:0}.fb_dialog_content .dialog_title>span{background:url(https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Cou7n-nqK52.gif) no-repeat 5px 50%;float:left;padding:5px 0 7px 26px}body.fb_hidden{height:100%;left:0;margin:0;overflow:visible;position:absolute;top:-10000px;transform:none;width:100%}.fb_dialog.fb_dialog_mobile.loading{background:url(https://static.xx.fbcdn.net/rsrc.php/v3/ya/r/3rhSv5V8j3o.gif) white no-repeat 50% 50%;min-height:100%;min-width:100%;overflow:hidden;position:absolute;top:0;z-index:10001}.fb_dialog.fb_dialog_mobile.loading.centered{background:none;height:auto;min-height:initial;min-width:initial;width:auto}.fb_dialog.fb_dialog_mobile.loading.centered #fb_dialog_loader_spinner{width:100%}.fb_dialog.fb_dialog_mobile.loading.centered .fb_dialog_content{background:none}.loading.centered #fb_dialog_loader_close{clear:both;color:#fff;display:block;font-size:18px;padding-top:20px}#fb-root #fb_dialog_ipad_overlay{background:rgba(0, 0, 0, .4);bottom:0;left:0;min-height:100%;position:absolute;right:0;top:0;width:100%;z-index:10000}#fb-root #fb_dialog_ipad_overlay.hidden{display:none}.fb_dialog.fb_dialog_mobile.loading iframe{visibility:hidden}.fb_dialog_mobile .fb_dialog_iframe{position:sticky;top:0}.fb_dialog_content .dialog_header{background:linear-gradient(from(#738aba), to(#2c4987));border-bottom:1px solid;border-color:#043b87;box-shadow:white 0 1px 1px -1px inset;color:#fff;font:bold 14px Helvetica, sans-serif;text-overflow:ellipsis;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0;vertical-align:middle;white-space:nowrap}.fb_dialog_content .dialog_header table{height:43px;width:100%}.fb_dialog_content .dialog_header td.header_left{font-size:12px;padding-left:5px;vertical-align:middle;width:60px}.fb_dialog_content .dialog_header td.header_right{font-size:12px;padding-right:5px;vertical-align:middle;width:60px}.fb_dialog_content .touchable_button{background:linear-gradient(from(#4267B2), to(#2a4887));background-clip:padding-box;border:1px solid #29487d;border-radius:3px;display:inline-block;line-height:18px;margin-top:3px;max-width:85px;padding:4px 12px;position:relative}.fb_dialog_content .dialog_header .touchable_button input{background:none;border:none;color:#fff;font:bold 12px Helvetica, sans-serif;margin:2px -12px;padding:2px 6px 3px 6px;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0}.fb_dialog_content .dialog_header .header_center{color:#fff;font-size:16px;font-weight:bold;line-height:18px;text-align:center;vertical-align:middle}.fb_dialog_content .dialog_content{background:url(https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/jKEcVPZFk-2.gif) no-repeat 50% 50%;border:1px solid #4a4a4a;border-bottom:0;border-top:0;height:150px}.fb_dialog_content .dialog_footer{background:#f5f6f7;border:1px solid #4a4a4a;border-top-color:#ccc;height:40px}#fb_dialog_loader_close{float:left}.fb_dialog.fb_dialog_mobile .fb_dialog_close_button{text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0}.fb_dialog.fb_dialog_mobile .fb_dialog_close_icon{visibility:hidden}#fb_dialog_loader_spinner{animation:rotateSpinner 1.2s linear infinite;background-color:transparent;background-image:url(https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/t-wz8gw1xG1.png);background-position:50% 50%;background-repeat:no-repeat;height:24px;width:24px}@keyframes rotateSpinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.fb_iframe_widget{display:inline-block;position:relative}.fb_iframe_widget span{display:inline-block;position:relative;text-align:justify}.fb_iframe_widget iframe{position:absolute}.fb_iframe_widget_fluid_desktop,.fb_iframe_widget_fluid_desktop span,.fb_iframe_widget_fluid_desktop iframe{max-width:100%}.fb_iframe_widget_fluid_desktop iframe{min-width:220px;position:relative}.fb_iframe_widget_lift{z-index:1}.fb_iframe_widget_fluid{display:inline}.fb_iframe_widget_fluid span{width:100%}</style>
<style>
.main-row {
height: 800px;
max-height: 100vh;
display: flex;
flex-direction: column;
flex-wrap: nowrap;
}
#eventimages {
flex: 1 auto;
max-height: calc(100vh - 400px);
overflow: hidden;
}
#eventimages .carousel-inner,
#eventimages .carousel-item {
height: 100%;
}
#eventimages .carousel-item img {
width: 100%;
height: 100%;
object-fit: cover;
}
.event-descr {
flex: 0 1 auto;
}
</style>
  </head>
 <body data-gr-c-s-loaded="true" cz-shortcut-listen="true">
    <div id="fb-root"></div>
    <script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1'; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));</script>
    <div class="container">
      <div class="row main-row">
        <div style="flex:0 0 55px; height: 56px; font-family: 'Marck Script'; font-size:33px;padding-top: 5px" class="col-md-12 text-center">
          Fuiibi
        </div> 
        <div id="eventimages" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
<?php 
$images = array_values((array)$event->pictures);
$lastimage = end($images);
reset($images);
foreach(array_slice($images,0,5) as $i=>$image) { 
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
                  <p>Register to <a class="was" href="https://www.fuiibi.com/">see them all</a></p>
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
        <div class="event-descr col-md-12" style="font-family: 'Roboto';">
          <h3 class="text-center" style="font-size: 22.5px; color: rgba(0,0,0,0.54); font-weight: 700; margin: .5em 0;"><?php echo $event->title ?></h3>
          <div class="list-group list-group-flush">
            <div class="list-group-item">
              <h6 class="list-group-item-heading">
                <i class="material-icons" style="color: rgba(0,0,0,0.54); padding-right: 4px;">place</i>
                <span style="position: relative; bottom: 5px;">
                  <?php echo $event->location->locality ?>
                </span>
              </h6>
            </div>
            <div class="list-group-item">
              <h6 class="list-group-item-heading glyphicon glyphicon-time">
                <i class="material-icons" style="color: rgba(0,0,0,0.54); padding-right: 4px">access_time</i>
                <span style="position: relative; bottom: 5px;">
                  <?php echo $event->date ?>
                </span>
              </h6>
            </div>
            <div class="list-group-item">
              <h6 class="list-group-item-heading glyphicon glyphicon-user">
                <i class="material-icons">supervisor_account</i>
                <span style="position: relative; bottom: 5px;"><?php printf("%d Fuiibers were there", count((array)$event->users)) ?></span>
              </h6>
            </div>
            <div class="text-center list-group-item">
              <h6 class="list-group-item-heading glyphicon glyphicon-user">
                Register to see the whole event and share own experience
              </h6>
              <p><a class="btn btn-primary was" href="https://www.fuiibi.com" role="button">I WAS THERE</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script>
  window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a.was').forEach(function(elm) {
      elm.addEventListener('click', function(e) {
        e.preventDefault()
          localStorage.return_to_event = "<?php echo $event->id ?>"
          setTimeout(function() { location.href = '/' },100 )
          return false
        })
      })
    })

</script>
  </body>
</html>
