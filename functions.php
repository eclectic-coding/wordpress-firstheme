<?php

require_once( 'lib/helpers.php' );
require_once( 'lib/enqueue-assets.php' );

apply_filters("_themename_no_posts_text", 'no_posts_text');
/**
 * Description of expected behavior
 *
 * @param $text
 *
 * @return string
 *
 * @since 1.0.0
 */
function no_posts_text($text) {
	return $text . 'No posts';
}

?>
