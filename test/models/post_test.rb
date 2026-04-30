require "test_helper"

class PostTest < ActiveSupport::TestCase
  test "is invalid without a title" do
    post = Post.new(body: "body", slug: "no-title")
    assert_not post.valid?
    assert_includes post.errors[:title], "can't be blank"
  end

  test "is invalid without a body" do
    post = Post.new(title: "Title", slug: "no-body")
    assert_not post.valid?
    assert_includes post.errors[:body], "can't be blank"
  end

  test "auto-generates a slug from the title when blank" do
    post = Post.new(title: "Building ToutiGame", body: "x")
    assert post.valid?
    assert_equal "building-toutigame", post.slug
  end

  test "normalizes provided slugs" do
    post = Post.new(title: "Note", body: "x", slug: "  Mixed Case Slug  ")
    assert post.valid?
    assert_equal "mixed-case-slug", post.slug
  end

  test "rejects duplicate slugs" do
    Post.create!(title: "Original", body: "x", slug: "shared-slug")
    duplicate = Post.new(title: "Other", body: "y", slug: "shared-slug")
    assert_not duplicate.valid?
    assert_includes duplicate.errors[:slug], "has already been taken"
  end

  test "published scope returns only published posts with a published_at" do
    published_slugs = Post.published.pluck(:slug)
    assert_includes published_slugs, posts(:published_one).slug
    assert_includes published_slugs, posts(:published_two).slug
    assert_not_includes published_slugs, posts(:draft_one).slug
  end

  test "drafts scope returns only drafts" do
    assert_equal [ posts(:draft_one).slug ], Post.drafts.pluck(:slug)
  end

  test "recent scope orders by published_at or created_at desc" do
    ordered = Post.published.recent.to_a
    assert_equal posts(:published_two), ordered.first
    assert_equal posts(:published_one), ordered.last
  end

  test "published? requires published flag and published_at" do
    assert posts(:published_one).published?
    assert_not posts(:draft_one).published?

    limbo = Post.new(title: "T", body: "b", slug: "limbo", published: true, published_at: nil)
    assert_not limbo.published?
  end
end
