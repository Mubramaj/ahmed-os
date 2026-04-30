# Represents a piece of writing on the personal site.
#
# Posts are stored as drafts by default. They become visible on the public
# `/writing` surface only after `published` is true. The slug is the public
# URL identifier and must be unique. If a slug is not provided it will be
# generated from the title before validation.
class Post < ApplicationRecord
  has_rich_text :body

  # Validations
  validates :title, presence: true
  validates :body, presence: true
  validates :slug,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/, message: "must be lowercase letters, numbers, and dashes" }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? && title.present? }
  before_validation :normalize_slug, if: -> { slug.present? }

  # Scopes for the public writing surface and admin lists.
  scope :published, -> { where(published: true).where.not(published_at: nil) }
  scope :drafts,    -> { where(published: false) }
  scope :recent,    -> { order(Arel.sql("COALESCE(published_at, created_at) DESC")) }

  # True when the post should appear on public writing pages.
  def published?
    published && published_at.present?
  end

  private

  # Build a URL-friendly slug from the title.
  # Example: "Building ToutiGame" -> "building-toutigame".
  def generate_slug
    self.slug = title.to_s.parameterize
  end

  # Keep slugs consistent: lowercase, trimmed, single-dash separated.
  def normalize_slug
    self.slug = slug.to_s.strip.downcase.parameterize
  end
end
