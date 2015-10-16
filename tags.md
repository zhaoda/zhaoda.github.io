---
title: 标签云
layout: page
permalink: /tags/
---
<div id='tag_cloud'>
  <div class="tags">
    {% for tag in site.tags  %}
    <code title="{{ tag[1].size }} posts" rel="{{ tag[1].size }}">{{ tag[0] }}</code>
    {% endfor  %}
  </div>
</div>
<hr hidden>
<script src="/assets/js/jquery.min.js"></script>
<script src="/assets/js/jquery.tagcloud.min.js"></script>
<script>
$.fn.tagcloud.defaults = {
  size: {start: 1, end: 2, unit: 'em'}, color: {start: '#ada8b5', end: '#000000'}
}
$(function () {
  $('#tag_cloud code').tagcloud()
})
</script>