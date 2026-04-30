module Admin
  # Editor surface for managing posts (drafts and published).
  #
  # Lives under /admin/posts and is intentionally separate from the public
  # /writing pages. Inherits authentication enforcement from Admin::BaseController.
  class PostsController < BaseController
    before_action :set_post, only: %i[show edit update destroy]

    # GET /admin/posts
    def index
      @posts = Post.recent
    end

    # GET /admin/posts/:id
    def show
    end

    # GET /admin/posts/new
    def new
      @post = Post.new
    end

    # GET /admin/posts/:id/edit
    def edit
    end

    # POST /admin/posts
    def create
      @post = Post.new(post_params)

      if @post.save
        redirect_to admin_post_path(@post), notice: "Post was successfully created."
      else
        render :new, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /admin/posts/:id
    def update
      if @post.update(post_params)
        redirect_to admin_post_path(@post), notice: "Post was successfully updated.", status: :see_other
      else
        render :edit, status: :unprocessable_entity
      end
    end

    # DELETE /admin/posts/:id
    def destroy
      @post.destroy!
      redirect_to admin_posts_path, notice: "Post was successfully destroyed.", status: :see_other
    end

    private

    # Admin lookups happen by primary key so editor URLs are stable even when
    # slugs change.
    def set_post
      @post = Post.find(params.expect(:id))
    end

    # Strong params for the editor form.
    def post_params
      params.expect(post: [ :title, :body, :slug, :category, :excerpt, :published, :published_at ])
    end
  end
end
