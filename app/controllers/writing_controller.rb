# Public surface for published writing.
#
# Lookups are slug-based and only published posts are exposed. Drafts are
# unreachable from the public site even if their slug is known.
class WritingController < ApplicationController
  # GET /writing
  def index
    @posts = Post.published.recent
  end

  # GET /writing/:slug
  def show
    @post = Post.published.find_by!(slug: params[:slug])
  end
end
