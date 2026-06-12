---
layout: page
permalink: /blog/
title: blog
nav: true
nav_order: 3
---

<section class="simple-page-section">
  {% assign posts = site.posts %}
  {% if posts and posts.size > 0 %}
    <div class="news">
      <div class="table-responsive">
        <table class="table table-sm table-borderless">
          {% for post in posts %}
            <tr>
              <th scope="row" style="width: 20%">{{ post.date | date: '%b %d, %Y' }}</th>
              <td>
                <a class="news-title" href="{{ post.url | relative_url }}" target="_blank" rel="noopener">{{ post.title }}</a>
                {% if post.description %}
                  <div class="mt-1">{{ post.description }}</div>
                {% endif %}
              </td>
            </tr>
          {% endfor %}
        </table>
      </div>
    </div>
  {% else %}
    <p>No posts so far...</p>
  {% endif %}
</section>
