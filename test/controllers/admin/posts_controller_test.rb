require "test_helper"

class Admin::PostsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @post = posts(:published_one)
  end

  test "index renders" do
    get admin_posts_url
    assert_response :success
  end

  test "new renders" do
    get new_admin_post_url
    assert_response :success
  end

  test "creates a post" do
    assert_difference("Post.count") do
      post admin_posts_url, params: {
        post: {
          title: "Newly Authored",
          body: "Some content",
          slug: "newly-authored",
          category: "essay",
          excerpt: "An excerpt.",
          published: false,
          published_at: nil
        }
      }
    end

    created = Post.find_by!(slug: "newly-authored")
    assert_redirected_to admin_post_url(created)
  end

  test "shows a post" do
    get admin_post_url(@post)
    assert_response :success
  end

  test "edit renders" do
    get edit_admin_post_url(@post)
    assert_response :success
  end

  test "updates a post" do
    patch admin_post_url(@post), params: {
      post: { title: "Updated Title", body: @post.body, slug: @post.slug }
    }
    assert_redirected_to admin_post_url(@post)
    assert_equal "Updated Title", @post.reload.title
  end

  test "destroys a post" do
    assert_difference("Post.count", -1) do
      delete admin_post_url(@post)
    end
    assert_redirected_to admin_posts_url
  end
end
