# Idempotent sample posts for development and for `db:seed:replant` in CI.
# Production stays empty so content is created via /admin/posts.

# Admin user — dev only. Production credentials must be created via:
#   bin/rails runner "User.create!(email_address: 'you@example.com', password: 'change_me')"
# Never commit real credentials here.
if Rails.env.development?
  User.find_or_create_by!(email_address: "admin@example.com") do |user|
    user.password = "password"
  end
end

unless Rails.env.production?
  Post.find_or_initialize_by(slug: "operating-notes").tap do |post|
    post.assign_attributes(
      title: "Operating notes",
      body: <<~TEXT,
        This post ships with `db:seed` so /writing is not empty on a fresh clone.
        Edit or delete it from /admin/posts.
      TEXT
      category: "note",
      excerpt: "Seed content — safe to remove.",
      published: true,
      published_at: Time.zone.local(2026, 4, 1, 12, 0, 0)
    )
    post.save!
  end

  Post.find_or_initialize_by(slug: "draft-backlog").tap do |post|
    post.assign_attributes(
      title: "Backlog draft",
      body: "A draft stays off /writing until Published is checked and Published at is set.",
      category: "log",
      excerpt: "Example draft.",
      published: false,
      published_at: nil
    )
    post.save!
  end
end
