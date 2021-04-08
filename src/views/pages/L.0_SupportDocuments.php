<div class="page page--content-height page--no-pad-bottom page-support-documents">
	<!--@integration:
		Document links will open in a new tab by default.  To prevent this behavior, change the :new_tab attribute value below to false.
		Note, absence of :new_tab attribute will result in the default value (true) being used.
	-->
	<support-documents inline-template :new_tab="true" v-cloak>
		<div class="support-documents subpage-parent" :style="{height:content_height}">
			<transition name="slide-left" v-on:enter="updateActiveScrollbarOffset">
				<div class="subpage" v-if="index_active" :style="{height:content_height}">
					<div class="subpage__scroll-container" ref="index_scroll_content">
						<div class="subpage__content-container" :style="{'margin-right':scrollbar_offset+'px'}">
							<div class="grid-container">
								<div class="support-documents__screen support-documents__screen--index">
									<div class="page__heading">
										<h1 class="page__title">Help &amp; Resources</h1>
									</div>
									<div class="page__content page__content--bleed">
										<div v-if="!component_loaded">
											<p v-if="load_error" class="text--alert">Error loading resources.</p>
											<p v-else-if="!loaded && loading_timeout">Loading...</p>
										</div>
										<p v-else-if="support_document_categories.length<1">
											<em>No Resources Available</em>
										</p>
										<div v-else class="support-documents__index">
											<div class="panel-link-group">
												<a href="#" v-on:click.prevent="setActiveCategory(category)" class="panel-link panel-link--simple" v-for="category in support_document_categories">
													<div class="panel-link__content">
														<div class="panel-link__text">
															{{category.name}}
														</div>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
			<transition name="slide-right" v-on:enter="updateActiveScrollbarOffset">
				<div class="subpage" v-if="!index_active" :style="{height:content_height}">
					<div class="support-documents__return" :class="{'is-scrolling':scrolling}">
						<div class="support-documents__return__container">
							<div class="grid-container">
								<div class="support-documents__return__content">
									<button class="icon-link icon-link--back" v-on:click.prevent="setActiveCategory(null)" type="button">
										Help &amp; Resources
									</button>
								</div>
							</div>
						</div>
					</div>
					<div class="subpage__scroll-container" ref="category_scroll_content" v-on:scroll="scrollCategory">
						<div class="subpage__content-container" :style="{'margin-right':scrollbar_offset+'px'}">
							<div class="grid-container">
								<div class="support-documents__screen support-documents__screen--category">
									<div class="support-documents-category" v-if="active_category">
										<h2 class="support-documents-category__name">{{active_category.name}}</h2>
										<div class="support-documents-category__subcategory" :class="{'support-documents-category__subcategory--no-name':!subcategory.name}" v-for="subcategory in active_category.subcategories">
											<h3 class="support-documents-category__subcategory-name" v-if="subcategory.name">
												{{subcategory.name}}
											</h3>
											<ul class="support-documents-category__document-list">
												<li class="support-documents-category__document-list-item" v-for="document in subcategory.documents">
													<a class="icon-link icon-link--document" :href="document.link" :target="new_tab?'_blank':'_self'" rel="noopener noreferrer">
														{{document.name}}
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</support-documents>
</div>