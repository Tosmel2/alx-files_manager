# alx-files_manager
<p>This project is a summary of this back-end trimester: authentication, NodeJS, MongoDB, Redis, pagination and background processing.</p>
<p>The objective is to build a simple platform to upload and view files:</p>

<ul>
<li>User authentication via a token </li>
<li>List all files</li>
<li>Upload a new file</li>
<li>Change permission of a file</li>
<li>View a file</li>
<li>Generate thumbnails for images</li>
</ul>

<h2>Resources</h2>

<p><strong>Read or watch</strong>:</p>

<ul>
<li><a href="/rltoken/kZHDWCu20EsKxKzi51yWeg" title="Node JS getting started" target="_blank">Node JS getting started</a></li>
<li><a href="/rltoken/uYPplj2cPK8pcP0LtV6RuA" title="Process API doc" target="_blank">Process API doc</a></li>
<li><a href="/rltoken/SujfeWKCWmUMomfETjETEg" title="Express getting started" target="_blank">Express getting started</a></li>
<li><a href="/rltoken/FzEwplmoZiyGvkgKllZNJw" title="Mocha documentation" target="_blank">Mocha documentation</a></li>
<li><a href="/rltoken/pdNNTX0OLugbhxvP3sLgOw" title="Nodemon documentation" target="_blank">Nodemon documentation</a></li>
<li><a href="/rltoken/g1x7y_3GskzVAJBTXcSjmA" title="MongoDB" target="_blank">MongoDB</a></li>
<li><a href="/rltoken/NkHBpGrxnd0sK_fDPMbihg" title="Bull" target="_blank">Bull</a></li>
<li><a href="/rltoken/KX6cck2nyLpQOTDMLcwxLg" title="Image thumbnail" target="_blank">Image thumbnail</a></li>
<li><a href="/rltoken/j9B0Kc-4HDKLUe88ShbOjQ" title="Mime-Types" target="_blank">Mime-Types</a></li>
<li><a href="/rltoken/nqwKRszO8Tkj_ZWW1EFwGw" title="Redis" target="_blank">Redis</a></li>
</ul>

<h2 dir="auto"><a id="user-content-results" class="anchor" aria-hidden="true" href="#results"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg></a>Results</h2>
<p dir="auto">Start server:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="tosmel@ADNEGS:~$ npm run start-server
Server running on port 5000
..."><pre class="notranslate"><code>tosmel@ADNEGS:~$ npm run start-server
Server running on port 5000
...
</code></pre></div>
<p dir="auto">Create user:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H &quot;Content-Type: application/json&quot; -d '{ &quot;email&quot;: &quot;tosmel@ADNEGS.com&quot;, &quot;password&quot;: &quot;1234!&quot; }' ; echo &quot;&quot;
{&quot;id&quot;:&quot;5f1e7d35c7ba06511e683b21&quot;,&quot;email&quot;:&quot;tosmel@ADNEGS.com&quot;}"><pre class="notranslate"><code>bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "bob@dylan.com", "password": "toto1234!" }' ; echo ""
{"id":"5f1e7d35c7ba06511e683b21","email":"bob@dylan.com"}
</code></pre></div>
<p dir="auto">Authenticate user:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content=" curl 0.0.0.0:5000/connect -H &quot;Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=&quot; ; echo &quot;&quot;
{&quot;token&quot;:&quot;031bffac-3edc-4e51-aaae-1c121317da8a&quot;}
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl 0.0.0.0:5000/users/me -H &quot;X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a&quot; ; echo &quot;&quot;
{&quot;id&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;email&quot;:&quot;tosmel@ADNEGS.com&quot;}
tosmel@ADNEGS:~$ "><pre class="notranslate"><code> curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"031bffac-3edc-4e51-aaae-1c121317da8a"}
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl 0.0.0.0:5000/users/me -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""
{"id":"5f1e7cda04a394508232559d","email":"tosmel@ADNEGS.com"}
tosmel@ADNEGS:~$ 
</code></pre></div>
<p dir="auto">Create file:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="tosmel@ADNEGS:~$ curl -XPOST 0.0.0.0:5000/files -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; -H &quot;Content-Type: application/json&quot; -d '{ &quot;name&quot;: &quot;myText.txt&quot;, &quot;type&quot;: &quot;file&quot;, &quot;data&quot;: &quot;SGVsbG8gV2Vic3RhY2shCg==&quot; }' ; echo &quot;&quot;
{&quot;id&quot;:&quot;5f1e879ec7ba06511e683b22&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;myText.txt&quot;,&quot;type&quot;:&quot;file&quot;,&quot;isPublic&quot;:false,&quot;parentId&quot;:0}
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ cat /tmp/files_manager/2a1f4fc3-687b-491a-a3d2-5808a02942c9 
Hello Webstack!"><pre class="notranslate"><code>tosmel@ADNEGS:~$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" -H "Content-Type: application/json" -d '{ "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==" }' ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ cat /tmp/files_manager/2a1f4fc3-687b-491a-a3d2-5808a02942c9 
Hello Webstack!
</code></pre></div>
<p dir="auto">Get files:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content=" curl -XGET 0.0.0.0:5000/files -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; ; echo &quot;&quot;
[{&quot;id&quot;:&quot;5f1e879ec7ba06511e683b22&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;myText.txt&quot;,&quot;type&quot;:&quot;file&quot;,&quot;isPublic&quot;:false,&quot;parentId&quot;:0},{&quot;id&quot;:&quot;5f1e881cc7ba06511e683b23&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;images&quot;,&quot;type&quot;:&quot;folder&quot;,&quot;isPublic&quot;:false,&quot;parentId&quot;:0},{&quot;id&quot;:&quot;5f1e8896c7ba06511e683b25&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;image.png&quot;,&quot;type&quot;:&quot;image&quot;,&quot;isPublic&quot;:true,&quot;parentId&quot;:&quot;5f1e881cc7ba06511e683b23&quot;}]
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl -XGET 0.0.0.0:5000/files?parentId=5f1e881cc7ba06511e683b23 -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; ; echo &quot;&quot;
[{&quot;id&quot;:&quot;5f1e8896c7ba06511e683b25&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;image.png&quot;,&quot;type&quot;:&quot;image&quot;,&quot;isPublic&quot;:true,&quot;parentId&quot;:&quot;5f1e881cc7ba06511e683b23&quot;}]
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; ; echo &quot;&quot;
{&quot;id&quot;:&quot;5f1e8896c7ba06511e683b25&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;image.png&quot;,&quot;type&quot;:&quot;image&quot;,&quot;isPublic&quot;:true,&quot;parentId&quot;:&quot;5f1e881cc7ba06511e683b23&quot;}
tosmel@ADNEGS:~$"><pre class="notranslate"><code> curl -XGET 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
[{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0},{"id":"5f1e881cc7ba06511e683b23","userId":"5f1e7cda04a394508232559d","name":"images","type":"folder","isPublic":false,"parentId":0},{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}]
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl -XGET 0.0.0.0:5000/files?parentId=5f1e881cc7ba06511e683b23 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
[{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}]
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}
tosmel@ADNEGS:~$
</code></pre></div>
<p dir="auto">Publish a file:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content="curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; ; echo &quot;&quot;
{&quot;id&quot;:&quot;5f1e8896c7ba06511e683b25&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;image.png&quot;,&quot;type&quot;:&quot;image&quot;,&quot;isPublic&quot;:false,&quot;parentId&quot;:&quot;5f1e881cc7ba06511e683b23&quot;}
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl -XPUT 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/publish -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; ; echo &quot;&quot;
{&quot;id&quot;:&quot;5f1e8896c7ba06511e683b25&quot;,&quot;userId&quot;:&quot;5f1e7cda04a394508232559d&quot;,&quot;name&quot;:&quot;image.png&quot;,&quot;type&quot;:&quot;image&quot;,&quot;isPublic&quot;:true,&quot;parentId&quot;:&quot;5f1e881cc7ba06511e683b23&quot;}"><pre class="notranslate"><code>curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":false,"parentId":"5f1e881cc7ba06511e683b23"}
tosmel@ADNEGS:~$
tosmel@ADNEGS:~$ curl -XPUT 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/publish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}
</code></pre></div>
<p dir="auto">Get a file's data:</p>
<div class="snippet-clipboard-content notranslate position-relative overflow-auto" data-snippet-clipboard-copy-content=" curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data -H &quot;X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f&quot; ; echo &quot;&quot;
Hello Webstack!"><pre class="notranslate"><code> curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
Hello Webstack!
</code></pre></div>
</article>
          </div>
      </div>

  </readme-toc>


</div>