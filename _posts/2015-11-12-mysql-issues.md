<hr>
<p>title: MySQL 常见问题汇总<br>
date: 2015-11-12 20:00<br>
tags: [mysql, issue]</p>
<hr>
<h2 id="mysql-5.6数据导入报-gtid-相关错误">MySQL 5.6数据导入报 GTID 相关错误</h2>
<p>从阿里云备份数据后还原到本地，用命令行 <code>mysql -uroot -p --default-character-set=&lt;character&gt; -f &lt;dbname&gt; &lt; &lt;backup.sql&gt;</code> 方式会报如下错误：</p>
<pre class=" language-bash"><code class="prism  language-bash">ERROR <span class="token number">1839</span> <span class="token punctuation">(</span>HY000<span class="token punctuation">)</span> at line <span class="token number">24</span><span class="token punctuation">:</span> @@GLOBAL<span class="token punctuation">.</span>GTID_PURGED can only be <span class="token keyword">set</span> when @@GLOBAL<span class="token punctuation">.</span>GTID_MODE <span class="token operator">=</span> ON<span class="token punctuation">.</span>
</code></pre>
<p>可以通过 <code>source</code> 方式导入解决。</p>
<pre class=" language-bash"><code class="prism  language-bash">$ mysql <span class="token operator">-</span>uroot <span class="token operator">-</span>p
$ use <span class="token operator">&lt;</span>dbname<span class="token operator">&gt;</span><span class="token punctuation">;</span>
$ <span class="token function">source</span> <span class="token operator">&lt;</span>backup<span class="token punctuation">.</span>sql<span class="token operator">&gt;</span><span class="token punctuation">;</span>
</code></pre>
<h2 id="os-x-通过-brew-安装-mysql">OS X 通过 brew 安装 MySQL</h2>
<pre class=" language-bash"><code class="prism  language-bash"><span class="token comment" spellcheck="true"># 安装
</span>$ brew <span class="token function">install</span> mysql <span class="token comment" spellcheck="true"># 5.6
</span>$ brew <span class="token function">install</span> mysql55 <span class="token comment" spellcheck="true"># 5.5
</span><span class="token comment" spellcheck="true"># 然后查看 brew info mysql 进行后续操作
</span></code></pre>
<p>修改 <code>my.cnf</code> 中的 <code>datadir</code> 切换数据库的存储位置。</p>
<p><a href="https://gist.github.com/mralexho/6cd3cf8b2ebbd4f33165">https://gist.github.com/mralexho/6cd3cf8b2ebbd4f33165</a></p>
<h2 id="查找本地-my.cnf">查找本地 my.cnf</h2>
<pre class=" language-bash"><code class="prism  language-bash"><span class="token function">sudo</span> <span class="token operator">/</span>usr<span class="token operator">/</span>libexec<span class="token operator">/</span><span class="token function">locate</span><span class="token punctuation">.</span>updatedb
<span class="token comment" spellcheck="true"># 可能要等待几分钟，然后继续
</span><span class="token function">locate</span> my<span class="token punctuation">.</span>cnf
</code></pre>