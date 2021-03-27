<?php

add_action( 'after_setup_theme', '_themename_theme_support' );
/**
 * Add theme supports
 *
 * @return void
 *
 * @since 1.0.0
 */
function _themename_theme_support() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-list', 'comment-form', 'gallery', 'caption' ) );

}
