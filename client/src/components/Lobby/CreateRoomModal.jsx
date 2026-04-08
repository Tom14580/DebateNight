import { useState } from 'react';
import Modal from '../shared/Modal';

export default function CreateRoomModal({ isOpen, onClose, topics, onCreateRoom }) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalTopic = selectedTopic || customTopic;
    
    if (!finalTopic.trim()) {
      alert('Please select or enter a topic');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreateRoom(finalTopic);
      setSelectedTopic('');
      setCustomTopic('');
      onClose();
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetTopicClick = (topic) => {
    setSelectedTopic(topic);
    setCustomTopic('');
  };

  if (!Array.isArray(topics) || topics.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Create New Debate Room">
        <div className="loading-state">
          <p>Loading topics...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Debate Room">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="form-label">Choose a preset topic:</label>
          <div className="topics-grid">
            {topics.map((topic, index) => (
              <button
                key={index}
                type="button"
                className={`topic-btn ${selectedTopic === topic ? 'topic-btn-selected' : ''}`}
                onClick={() => handlePresetTopicClick(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="form-divider">OR</div>

        <div className="form-section">
          <label htmlFor="customTopic" className="form-label">
            Enter your own topic:
          </label>
          <input
            id="customTopic"
            type="text"
            className="input"
            placeholder="e.g., Should we colonize Mars?"
            value={customTopic}
            onChange={(e) => {
              setCustomTopic(e.target.value);
              setSelectedTopic('');
            }}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </form>
    </Modal>
  );
}