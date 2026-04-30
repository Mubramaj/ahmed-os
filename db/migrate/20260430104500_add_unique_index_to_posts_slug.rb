class AddUniqueIndexToPostsSlug < ActiveRecord::Migration[8.1]
  # Enforce slug uniqueness at the database level so concurrent writes
  # cannot create duplicates that bypass model validations.
  def change
    add_index :posts, :slug, unique: true
  end
end
